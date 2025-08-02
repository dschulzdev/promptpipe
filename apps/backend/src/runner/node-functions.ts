import { UserModelMessage } from "ai";
import { AiService } from "src/ai/ai.service";
import { NodeTypes } from "src/workflow/dto/nodes.dto";
import {
	LlmNodeDto,
	PipelineNodeDto,
	TextGenerationNodeDto,
	TextInputNodeDto,
	TextOutputNodeDto,
} from "src/workflow/dto/pipeline-node.dto";
import { RunWorkloadDto } from "src/workflow/dto/run-workflow.dto";

export type HandleDataResult = {
	key: string;
	// biome-ignore lint/suspicious/noExplicitAny: not typed yet
	data: any;
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
			role: "user",
			content: node.data.prompt,
		},
	] satisfies UserModelMessage[];
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

export async function processTextGenerationNodeHandles(
	node: TextGenerationNodeDto,
	workflowData: RunWorkloadDto,
	nodeHandleOutputMap: NodeOutputMap,
	aiService: AiService,
) {
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
			const results = await processNode(
				parentNode,
				workflowData,
				nodeHandleOutputMap,
				aiService,
			);

			for (const entry of results) {
				if (!entry) {
					continue;
				}
				nodeHandleOutputMap.set(entry.key, {
					data: entry.data,
				});
			}
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

	const response = await aiService.getResponse({
		modelConfig: aiService.getLLMProvider({ modelConfig: llmProvider.data }),
		messages: messages.data,
	});
	nodeHandleOutputMap.set(node.id, response);
	return response;
}

export const processNode = async (
	node: PipelineNodeDto,
	workflowData: RunWorkloadDto,
	nodeHandleOutputMap: NodeOutputMap,
	aiService: AiService,
): Promise<Array<HandleDataResult>> => {
	switch (node.type) {
		case NodeTypes.LLM:
			return [
				{
					key: node.id,
					data: processLLMNodeHandles(node),
				},
			];
		case NodeTypes.TEXT_INPUT:
			return [
				{
					key: node.id,
					data: processTextInputNodeHandles(node),
				},
			];
		case NodeTypes.TEXT_OUTPUT:
			return [
				{
					key: node.id,
					data: processTextOutputNodeHandles(
						node,
						workflowData,
						nodeHandleOutputMap,
					),
				},
			];
		case NodeTypes.TEXT_GENERATION:
			return [
				{
					key: node.id,
					data: await processTextGenerationNodeHandles(
						node,
						workflowData,
						nodeHandleOutputMap,
						aiService,
					),
				},
			];
		default:
			throw new Error(`Unsupported node type: ${node.type}`);
	}
};
