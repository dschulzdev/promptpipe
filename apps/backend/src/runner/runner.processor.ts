import { RedisService } from "@liaoliaots/nestjs-redis";
import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { BadRequestException, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import Redis from "ioredis";
import { ResultAsync } from "neverthrow";
import { NodeTypes } from "src/workflow/dto/nodes.dto";
import { PipelineNodeDto } from "src/workflow/dto/pipeline-node.dto";
import { RunWorkloadDto } from "src/workflow/dto/run-workflow.dto";
import { AiService } from "../ai/ai.service";
import { deleteUnlinkedNodes, isNextNodeAvailable } from "./graph-functions";
import { processNode } from "./node-functions";
import { ProgressMessage, ResultMessage } from "./progress-message";

@Processor("workflow_runs")
export class RunnerProcessor extends WorkerHost {
	private readonly logger = new Logger(RunnerProcessor.name, {
		timestamp: true,
	});
	// We use a separate Redis client for publishing progress

	private redisPublisher: Redis;

	constructor(
		private readonly redisService: RedisService,
		private readonly aiService: AiService,
	) {
		super();
		// Initialize the Redis publisher using the RedisService
		this.redisPublisher = this.redisService.getOrThrow();
	}

	private publishProgress = (
		jobId: string,
		type: string,
		payload: ProgressMessage | ResultMessage,
	) => {
		MessageEvent;
		const channel = `workflow-progress:${jobId}`;
		const messagesKey = `workflow-messages:${jobId}`;
		const message = JSON.stringify({ type, payload });

		this.logger.log(`Publishing ${type} to channel ${channel}:`, payload);

		// Store the message in Redis list for replay
		this.redisPublisher.lpush(messagesKey, message);

		// Set TTL for the messages list (24 hours) - this will extend the TTL each time
		this.redisPublisher.expire(messagesKey, 86400);

		// Publish to live subscribers
		this.redisPublisher.publish(channel, message);
	};

	// This method is called when a new job is available
	async process(
		job: Job<RunWorkloadDto, ResultMessage, string>,
	): Promise<ResultMessage> {
		// biome-ignore lint/style/noNonNullAssertion: job id has to exist
		const jobId: string = job.id!;
		this.logger.log(`Worker processing job ${jobId} for workflow ${jobId}`);

		const { cleanedPayload, startNode } = this.initializeTest(jobId, job.data);

		if (!startNode) {
			throw new BadRequestException(
				"No start node found in the workflow data.",
			);
		}

		await ResultAsync.fromPromise(
			this.runGraph(startNode as PipelineNodeDto, jobId, cleanedPayload),
			(error) => {
				if (error instanceof Error) {
					this.logger.error(`Graph execution failed: ${error.message}`);
				}
				const finalResult = this.sendFinalResult(jobId, "fail");
				return finalResult;
			},
		);

		const finalResult = this.sendFinalResult(jobId, "success");
		return finalResult; // This is the return value of the job
	}

	private async runGraph(
		startNode: PipelineNodeDto,
		jobId: string,
		cleanedPayload: RunWorkloadDto,
	) {
		let currentNode: PipelineNodeDto = startNode;
		// biome-ignore lint/suspicious/noExplicitAny: We need to use any here to allow dynamic typing
		const nodeOutputMap = new Map<string, any>();
		while (isNextNodeAvailable(cleanedPayload, currentNode)) {
			this.publishProgress(jobId, "log", {
				log: `Processing node ${currentNode.id}`,
				type: "progress",
			});
			const results = await processNode(
				currentNode,
				cleanedPayload,
				nodeOutputMap,
				this.aiService,
			);
			for (const entry of results) {
				if (!entry) {
					continue;
				}
				nodeOutputMap.set(entry.key, {
					data: entry.data,
				});
			}
			this.publishProgress(jobId, "log", {
				log: `Node finished: ${currentNode.id}`,
				type: "success_node",
			});

			const nextNode = this.getNextNode(currentNode.id, cleanedPayload);
			if (!nextNode) {
				break;
			}
			currentNode = nextNode;
		}
	}

	private getNextNode(
		currentNodeId: string,
		payload: RunWorkloadDto,
	): PipelineNodeDto | undefined {
		const nextConnection = payload.connections.find(
			(connection) => connection.sourceNodeId === currentNodeId,
		);
		if (!nextConnection) {
			return undefined;
		}
		return payload.nodes.find(
			(node) => node.id === nextConnection.targetNodeId,
		);
	}

	private initializeTest(jobId: string, workflowData: RunWorkloadDto) {
		this.publishProgress(jobId, "log", {
			log: `Starting job ${jobId}`,
			type: "progress",
		});
		const cleanedPayload = deleteUnlinkedNodes(workflowData);
		const startNode = workflowData.nodes.find(
			(node) => node.type === NodeTypes.BASIC_START,
		);
		return { cleanedPayload, startNode };
	}

	private sendFinalResult(
		jobId: string,
		result: ResultMessage["result"],
	): ResultMessage {
		const finalResult: ResultMessage = {
			type: "result",
			result: result,
			log:
				result === "success"
					? `Job ${jobId} completed successfully!`
					: `Job ${jobId} failed!`,
		};
		this.publishProgress(jobId, "result", finalResult);
		this.logger.log(`Job ${jobId} completed successfully!`);
		return finalResult;
	}

	// Optional: Listen to events for logging/monitoring
	@OnWorkerEvent("completed")
	onCompleted(job: Job) {
		console.log(`Job ${job.id} has completed!`);
		// Close the pub/sub channel for this job
		const channel = `workflow-progress:${job.id}`;
		const messagesKey = `workflow-messages:${job.id}`;
		const message = JSON.stringify({ type: "done" });

		// Store the message in Redis list for replay
		this.redisPublisher.lpush(messagesKey, message);

		// Set TTL for the messages list (24 hours)
		this.redisPublisher.expire(messagesKey, 86400);

		// Publish to live subscribers
		this.redisPublisher.publish(channel, message);
	}

	@OnWorkerEvent("failed")
	onFailed(job: Job, err: Error) {
		console.log(`Job ${job.id} has failed with error: ${err.message}`);
		console.log(err.stack);
		const channel = `workflow-progress:${job.id}`;
		const messagesKey = `workflow-messages:${job.id}`;
		const message = JSON.stringify({ type: "error", payload: err.message });

		// Store the message in Redis list for replay
		this.redisPublisher.lpush(messagesKey, message);

		// Set TTL for the messages list (24 hours)
		this.redisPublisher.expire(messagesKey, 86400);

		// Publish to live subscribers
		this.redisPublisher.publish(channel, message);
	}
}
