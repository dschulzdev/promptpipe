import { RedisService } from "@liaoliaots/nestjs-redis";
import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import Redis from "ioredis";

@Processor("workflow_runs")
export class RunnerProcessor extends WorkerHost {
	// We use a separate Redis client for publishing progress

	private redisPublisher: Redis;

	constructor(private readonly redisService: RedisService) {
		super();
		// Initialize the Redis publisher using the RedisService
		this.redisPublisher = this.redisService.getOrThrow();
	}

	// This method is called when a new job is available
	async process(
		job: Job<
			{ workflowId: string },
			{ success: boolean; output: string },
			string
		>,
	): Promise<{ success: boolean; output: string }> {
		console.log(`Worker processing job ${job.id} for workflow ${job.id}`);

		const publishProgress = (type: string, payload: any) => {
			const channel = `workflow-progress:${job.id}`;
			console.log(`Publishing ${type} to channel ${channel}:`, payload);
			this.redisPublisher.publish(channel, JSON.stringify({ type, payload }));
		};

		// Simulate long-running process
		publishProgress("log", "Step 1: Initializing...");
		await new Promise((res) => setTimeout(res, 20000));

		publishProgress("log", "Step 2: Processing data...");
		await new Promise((res) => setTimeout(res, 2000));

		publishProgress("log", "Step 3: Almost done, finalizing results.");
		await new Promise((res) => setTimeout(res, 1500));

		const finalResult = {
			success: true,
			output: `Workflow ${job.data.workflowId} completed successfully!`,
		};

		// Publish the final result before completing
		publishProgress("result", finalResult);

		return finalResult; // This is the return value of the job
	}

	// Optional: Listen to events for logging/monitoring
	@OnWorkerEvent("completed")
	onCompleted(job: Job) {
		console.log(`Job ${job.id} has completed!`);
		// Close the pub/sub channel for this job
		const channel = `workflow-progress:${job.id}`;
		this.redisPublisher.publish(channel, JSON.stringify({ type: "done" }));
	}

	@OnWorkerEvent("failed")
	onFailed(job: Job, err: Error) {
		console.log(`Job ${job.id} has failed with error: ${err.message}`);
		const channel = `workflow-progress:${job.id}`;
		this.redisPublisher.publish(
			channel,
			JSON.stringify({ type: "error", payload: err.message }),
		);
	}
}
