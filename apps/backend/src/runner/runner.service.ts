import { RedisService } from "@liaoliaots/nestjs-redis";
import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, MessageEvent } from "@nestjs/common";
import { Queue } from "bullmq";
import Redis from "ioredis";
import { Observable } from "rxjs";

@Injectable()
export class RunnerService {
	private redisPublisher: Redis;
	private redisSubscriber: Redis;
	constructor(
		@InjectQueue("workflow_runs") private readonly workflowRunsQueue: Queue,
		private readonly redisService: RedisService,
	) {
		// Initialize the Redis publisher using the RedisService
		this.redisPublisher = this.redisService.getOrThrow();
		this.redisSubscriber = this.redisService.getOrThrow("runner-subscriber");
	}

	public async runWorkflow(workflowData: string): Promise<string | undefined> {
		const job = await this.workflowRunsQueue.add("workflow_runs", {
			workflowData,
		});
		const isWaiting = await job.isWaiting();
		if (isWaiting) {
			console.log(`Job ${job.id} is waiting in the queue.`);
			this.redisPublisher.publish(
				`workflow-progress:${job.id}`,
				JSON.stringify({ type: "waiting", payload: { jobId: job.id } }),
			);
		}
		return job.id;
	}

	getJobStream(jobId: string): Observable<MessageEvent> {
		return new Observable((subscriber) => {
			const progressChannel = `workflow-progress:${jobId}`;

			console.log(
				`Starting stream for job ${jobId} on channel ${progressChannel}`,
			);

			this.redisSubscriber.subscribe(progressChannel, (err) => {
				if (err) {
					subscriber.error(
						new Error(`Failed to subscribe to ${progressChannel}`),
					);
				}
			});

			this.redisSubscriber.on("message", (channel, message) => {
				if (channel === progressChannel) {
					const data = JSON.parse(message);
					// The service is responsible for formatting the event correctly
					subscriber.next({ data: message });

					if (["result", "error", "done"].includes(data.type)) {
						subscriber.complete();
					}
				}
			});

			// The cleanup logic now lives here
			return () => {
				console.log(
					`Stream for job ${jobId} ended. Cleaning up service resources.`,
				);
				this.redisSubscriber.unsubscribe(progressChannel);
			};
		});
	}
}
