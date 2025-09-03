import { RedisService } from "@liaoliaots/nestjs-redis";
import { InjectQueue } from "@nestjs/bullmq";
import { BadRequestException, Injectable, MessageEvent } from "@nestjs/common";
import { Queue } from "bullmq";
import Redis from "ioredis";
import { Observable } from "rxjs";
import { RunWorkloadDto } from "src/workflow/dto/run-workflow.dto";
import { hasCycle } from "./graph-processing/graph-functions";
import { ProgressMessage } from "./progress-message";

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

	public async runWorkflow(
		workflowData: RunWorkloadDto,
	): Promise<string | undefined> {
		if (hasCycle(workflowData.connections)) {
			throw new BadRequestException(
				"Workflow contains a cycle. Cycles are currently not supported.",
			);
		}
		const job = await this.workflowRunsQueue.add("workflow_runs", workflowData);
		const isWaiting = await job.isWaiting();
		if (isWaiting) {
			console.log(`Job ${job.id} is waiting in the queue.`);
			const message = JSON.stringify({
				type: "waiting",
				payload: { jobId: job.id },
			});

			// Store the message in Redis list for replay
			const messagesKey = `workflow-messages:${job.id}`;
			await this.redisPublisher.lpush(messagesKey, message);

			// Set TTL for the messages list (24 hours)
			await this.redisPublisher.expire(messagesKey, 86400);

			// Publish to live subscribers
			this.redisPublisher.publish(`workflow-progress:${job.id}`, message);
		}
		return job.id;
	}

	getJobStream(jobId: string): Observable<MessageEvent> {
		return new Observable((subscriber) => {
			const progressChannel = `workflow-progress:${jobId}`;
			const messagesKey = `workflow-messages:${jobId}`;

			console.log(
				`Starting stream for job ${jobId} on channel ${progressChannel}`,
			);

			const setupSubscription = async () => {
				try {
					// First, replay all existing messages
					const existingMessages = await this.redisPublisher.lrange(
						messagesKey,
						0,
						-1,
					);
					console.log(
						`Replaying ${existingMessages.length} existing messages for job ${jobId}`,
					);

					for (const message of existingMessages.reverse()) {
						const data: {
							type:
								| "log"
								| "progress_node"
								| "success_node"
								| "result_success"
								| "result_fail"
								| "fail_node"
								| "result"
								| "error"
								| "done";
							payload: ProgressMessage;
						} = JSON.parse(message);
						subscriber.next({ data: message });

						// If this is a final message, complete after replaying
						if (["result", "error", "done"].includes(data.type)) {
							subscriber.complete();
							return;
						}
					}

					// Then subscribe to new messages
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

							if (
								["result_success", "result_fail", "error", "done"].includes(
									data.type,
								)
							) {
								subscriber.complete();
							}
						}
					});
				} catch (error) {
					subscriber.error(error);
				}
			};

			setupSubscription();

			// The cleanup logic now lives here
			return () => {
				console.log(
					`Stream for job ${jobId} ended. Cleaning up service resources.`,
				);
				this.redisSubscriber.unsubscribe(progressChannel);
				this.cleanupWorkflowMessages(jobId);
			};
		});
	}

	public async cleanupWorkflowMessages(jobId: string): Promise<void> {
		const messagesKey = `workflow-messages:${jobId}`;
		await this.redisPublisher.del(messagesKey);
		console.log(`Cleaned up messages for job ${jobId}`);
	}
}
