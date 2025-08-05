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
	const connectionTargetId = workflowData.connections.find((connection) => {
		return connection.sourceNodeId === node.id;
	})?.targetNodeId;

	if (!connectionTargetId) {
		return "";
	}
	return {
		response: nodeHandleOutputMap.get(connectionTargetId)?.data || "",
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
			(c) => c.sourceNodeHandleId === handle.id,
		);
		return connection?.targetNodeId || null;
	});

	for (const targetId of connectionTargets) {
		if (!targetId) continue;

		if (!nodeHandleOutputMap.has(targetId)) {
			const parentNode = workflowData.nodes.find((n) => n.id === targetId);
			if (!parentNode) {
				throw new Error(`Parent node with ID ${targetId} not found`);
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
		.filter((targetId): targetId is string => targetId !== null)
		.flatMap((targetId) => {
			const output = nodeHandleOutputMap.get(targetId);
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
			return connection.sourceNodeId === node.id;
		})
		?.map((connection) => connection.targetNodeId);
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
			connection.sourceNodeId === node.id &&
			connection.sourceNodeHandleId === "llm"
		);
	});
	const promptId = workflowData.connections.find((connection) => {
		return (
			connection.sourceNodeId === node.id &&
			connection.sourceNodeHandleId === "prompt"
		);
	});

	if (!llmProviderId) {
		throw new Error(`LLM provider connection not found for node ${node.id}`);
	}
	if (!promptId) {
		throw new Error(`Prompt connection not found for node ${node.id}`);
	}

	const llmProvider = nodeHandleOutputMap.get(llmProviderId.targetNodeId);
	const messages = nodeHandleOutputMap.get(promptId.targetNodeId);

	if (!llmProvider || !llmProvider.data) {
		throw new Error(
			`LLM provider data not found for target ${llmProviderId.targetNodeId}`,
		);
	}
	if (!messages || !messages.data) {
		throw new Error(
			`Messages data not found for target ${promptId.targetNodeId}`,
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
	switch (node.type) {
		case NodeTypes.LLM: {
			const data = processLLMNodeHandles(node);
			returnData.push({
				key: node.id,
				data,
			});
			break;
		}
		case NodeTypes.TEXT_INPUT: {
			const data = processTextInputNodeHandles(node);
			returnData.push({
				key: node.id,
				data,
			});
			break;
		}
		case NodeTypes.TEXT_OUTPUT: {
			const data = processTextOutputNodeHandles(
				node,
				workflowData,
				nodeHandleOutputMap,
			);
			returnData.push({
				key: node.id,
				data,
			});
			break;
		}
		case NodeTypes.TEXT_GENERATION: {
			const data = await processTextGenerationNodeHandles({
				node,
				workflowData,
				nodeHandleOutputMap,
				aiService,
				onStart,
				onEnd,
			});
			returnData.push({
				key: node.id,
				data,
			});
			break;
		}
		case NodeTypes.MERGE: {
			const data = await processMergeNodeHandles(
				node as MergeNodeDto,
				workflowData,
				nodeHandleOutputMap,
				aiService,
				onStart,
				onEnd,
			);
			returnData.push({
				key: node.id,
				data,
			});
			break;
		}
		case NodeTypes.BASIC_START: {
			// Start nodes typically don't have outputs, but we can return the base value
			break;
		}
	}
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
