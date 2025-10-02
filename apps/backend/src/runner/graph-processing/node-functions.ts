import { ModelMessage } from "ai";
import { AiService } from "src/ai/ai.service";
import { NodeTypes } from "src/workflow/dto/nodes.dto";
import {
	LlmNodeDto,
	MergeNodeDto,
	PipelineNodeDto,
	TextInputNodeDto,
	TextOutputNodeDto,
} from "src/workflow/dto/pipeline-node.dto";
import { RunWorkloadDto } from "src/workflow/dto/run-workflow.dto";

export type HandleDataResult = {
	key: string;
	// biome-ignore lint/suspicious/noExplicitAny: not typed yet
	data: any;
};

type ProcessNodeParams = {
	node: PipelineNodeDto;
	workflowData: RunWorkloadDto;
	nodeHandleOutputMap: NodeOutputMap;
	aiService: AiService;
	onStart?: (id?: string) => void;
	onEnd?: (id?: string) => void;
};

export type NodeOutputMap = Map<
	HandleDataResult["key"],
	HandleDataResult["data"]
>;

export function processLLMNodeHandles(node: LlmNodeDto) {
	// Implement the logic to process LLM node handles
	if (!node.data.llmModel || !node.data.llmProvider) {
		throw new Error(
			"LLM node missing required model or provider configuration",
		);
	}
	return {
		model: node.data.llmModel,
		provider: node.data.llmProvider,
	};
}

export function processTextInputNodeHandles(node: TextInputNodeDto) {
	return [
		{
			role: node.data.role,
			content: node.data.prompt,
		},
	] satisfies ModelMessage[];
}

export function processTextOutputNodeHandles(
	node: TextOutputNodeDto,
	workflowData: RunWorkloadDto,
	nodeHandleOutputMap: NodeOutputMap,
) {
	const connection = workflowData.connections.find(
		(connection) => connection.targetNodeId === node.id,
	);

	if (!connection) {
		return { response: [] };
	}

	const sourceNodeId = connection.sourceNodeId;
	const output = nodeHandleOutputMap.get(sourceNodeId);

	return {
		response: output?.data || [],
	};
}

export async function processMergeNodeHandles(
	node: MergeNodeDto,
	workflowData: RunWorkloadDto,
	nodeHandleOutputMap: NodeOutputMap,
	aiService: AiService,
	onStart = (id?: string) => {},
	onEnd = (id?: string) => {},
) {
	const handles = node.data.inputs;
	const connectionTargets = handles.map((handle) => {
		const connection = workflowData.connections.find(
			(c) => c.targetNodeHandleId === handle.id,
		);
		return connection?.sourceNodeId || null;
	});

	for (const sourceId of connectionTargets) {
		if (!sourceId) continue;

		if (!nodeHandleOutputMap.has(sourceId)) {
			const parentNode = workflowData.nodes.find((n) => n.id === sourceId);
			if (!parentNode) {
				throw new Error(`Parent node with ID ${sourceId} not found`);
			}
			// TODO: Add cycle detection to prevent infinite recursion
			await processNode({
				node: parentNode,
				workflowData,
				nodeHandleOutputMap,
				onStart: () => {
					onStart(parentNode.id);
				},
				onEnd: () => {
					onEnd(parentNode.id);
				},
				aiService,
			});
		}
	}

	const inputs = connectionTargets
		.filter((sourceId): sourceId is string => sourceId !== null)
		.flatMap((sourceId) => {
			const output = nodeHandleOutputMap.get(sourceId);
			if (!output || output.data === undefined) {
				return [];
			}
			return Array.isArray(output.data) ? output.data : [output.data];
		});

	return inputs;
}

export async function processTextGenerationNodeHandles({
	node,
	workflowData,
	nodeHandleOutputMap,
	aiService,
	onStart = () => {},
	onEnd = () => {},
}: ProcessNodeParams) {
	const connectionTargetId = workflowData.connections
		.filter((connection) => {
			return connection.targetNodeId === node.id;
		})
		?.map((connection) => connection.sourceNodeId);
	for (const targetId of connectionTargetId) {
		if (!nodeHandleOutputMap.has(targetId)) {
			const parentNode = workflowData.nodes.find((n) => n.id === targetId);
			if (!parentNode) {
				throw new Error(`Parent node with ID ${targetId} not found`);
			}
			await processNode({
				node: parentNode,
				workflowData,
				nodeHandleOutputMap,
				aiService,
				onStart: () => {
					onStart(parentNode.id);
				},
				onEnd: () => {
					onEnd(parentNode.id);
				},
			});
		}
	}
	const llmProviderId = workflowData.connections.find((connection) => {
		return (
			connection.targetNodeId === node.id &&
			connection.targetNodeHandleId === "llm"
		);
	});
	const promptId = workflowData.connections.find((connection) => {
		return (
			connection.targetNodeId === node.id &&
			connection.targetNodeHandleId === "prompt"
		);
	});

	if (!llmProviderId) {
		throw new Error(`LLM provider connection not found for node ${node.id}`);
	}
	if (!promptId) {
		throw new Error(`Prompt connection not found for node ${node.id}`);
	}

	const llmProvider = nodeHandleOutputMap.get(llmProviderId.sourceNodeId);
	const messages = nodeHandleOutputMap.get(promptId.sourceNodeId);

	if (!llmProvider || !llmProvider.data) {
		throw new Error(
			`LLM provider data not found for source ${llmProviderId.sourceNodeId}`,
		);
	}
	if (!messages || !messages.data) {
		throw new Error(
			`Messages data not found for source ${promptId.sourceNodeId}`,
		);
	}

	console.log("Messages:", messages);
	const lastMessage = messages.data.at(-1);
	if (lastMessage.role !== "user") {
		throw new Error("The last message must be from the user.");
	}

	const response = await aiService.getResponse({
		modelConfig: aiService.getLLMProvider({ modelConfig: llmProvider.data }),
		messages: messages.data,
	});
	nodeHandleOutputMap.set(node.id, response);
	return response;
}

export const processNode = async ({
	node,
	workflowData,
	nodeHandleOutputMap,
	aiService,
	onStart = () => {},
	onEnd = () => {},
}: ProcessNodeParams): Promise<void> => {
	onStart(node.id);

	const returnData: HandleDataResult[] = [];
	// biome-ignore lint/suspicious/noExplicitAny: Should be typed at some point
	let data: any;
	switch (node.type) {
		case NodeTypes.LLM: {
			data = processLLMNodeHandles(node);
			break;
		}
		case NodeTypes.TEXT_INPUT: {
			data = processTextInputNodeHandles(node);
			break;
		}
		case NodeTypes.TEXT_OUTPUT: {
			data = processTextOutputNodeHandles(
				node,
				workflowData,
				nodeHandleOutputMap,
			);
			break;
		}
		case NodeTypes.TEXT_GENERATION: {
			data = await processTextGenerationNodeHandles({
				node,
				workflowData,
				nodeHandleOutputMap,
				aiService,
				onStart,
				onEnd,
			});
			break;
		}
		case NodeTypes.MERGE: {
			data = await processMergeNodeHandles(
				node as MergeNodeDto,
				workflowData,
				nodeHandleOutputMap,
				aiService,
				onStart,
				onEnd,
			);
			break;
		}
		case NodeTypes.STRUCTURED_OUTPUT: {
			data = await processTextGenerationNodeHandles({
				node,
				workflowData,
				nodeHandleOutputMap,
				aiService,
				onStart,
				onEnd,
			});
			break;
		}
		case NodeTypes.BASIC_START: {
			// Start nodes typically don't have outputs, but we can return the base value
			break;
		}
	}
	returnData.push({
		key: node.id,
		data,
	});
	for (const entry of returnData) {
		if (!entry) {
			continue;
		}
		nodeHandleOutputMap.set(entry.key, {
			data: entry.data,
		});
	}
	onEnd(node.id);
};
