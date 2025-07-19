import { RedisService } from "@liaoliaots/nestjs-redis";
import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { BadRequestException, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import Redis from "ioredis";
import { NodeTypes } from "src/workflow/dto/nodes.dto";
import { PipelineNodeDto } from "src/workflow/dto/pipeline-node.dto";
import { RunWorkloadDto } from "src/workflow/dto/run-workload.dto";
import { AiService } from "../ai/ai.service";
import { deleteUnlinkedNodes, isNextNodeAvailable } from "./graph-functions";
import { processLLMNodeHandles } from "./node-functions";
import { ProgressMessage, ResultMessage } from "./progress-message";

type NodeProcessCacheEntry = {
	data: any;
};

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
		this.logger.log(`Worker processing job ${job.id} for workflow ${job.id}`);

		const { cleanedPayload, startNode } = this.initializeTest(
			// biome-ignore lint/style/noNonNullAssertion: job id has to exist
			job.id!,
			job.data,
		);
		if (!startNode) {
			throw new BadRequestException(
				"No start node found in the workflow data.",
			);
		}
		let currentNode: PipelineNodeDto = startNode;
		const nodeOutputMap = new Map<string, NodeProcessCacheEntry>();
		while (isNextNodeAvailable(cleanedPayload, currentNode)) {
			const { results } = await this.processNode(currentNode);
			for (const { key, result } of results) {
				if (!key) {
					continue;
				}
				nodeOutputMap.set(key, {
					data: result.data,
				});
			}

			const nextNode = this.getNextNode(currentNode.id, cleanedPayload);
			if (!nextNode) {
				break;
			}
			currentNode = nextNode;
		}

		// biome-ignore lint/style/noNonNullAssertion: job id has to exist
		const finalResult = this.sendFinalResult(job.id!, "success");
		return finalResult; // This is the return value of the job
	}

	private processNode = async (
		node: PipelineNodeDto,
	): Promise<{
		results: {
			key: string;
			result: NodeProcessCacheEntry;
		}[];
	}> => {
		let data: any = {};
		switch (node.type) {
			case NodeTypes.LLM:
				data = processLLMNodeHandles(node.data);
		}
		// Process the node using the cleaned payload
		return {
			results: [
				{
					key: node.id,
					result: {
						data: data,
					},
				},
			],
		};
	};

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
		const startNode = cleanedPayload.nodes.find(
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
