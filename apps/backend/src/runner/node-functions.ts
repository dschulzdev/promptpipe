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
	return {
		model: node.data.llmModel,
		provider: node.data.llmProvider,
	};
}

export function processTextInputNodeHandles(node: TextInputNodeDto) {
	return {
		role: "user",
		content: node.data.prompt,
	} as UserModelMessage;
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
	return nodeHandleOutputMap.get(connectionTargetId)?.data || "";
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
	// biome-ignore lint/style/noNonNullAssertion: should be there
	const llmProvider = nodeHandleOutputMap.get(llmProviderId!.targetNodeId);
	// biome-ignore lint/style/noNonNullAssertion: should be there
	const prompt = nodeHandleOutputMap.get(promptId!.targetNodeId);
	console.log("LLM Provider:", llmProvider);
	console.log("Prompt:", prompt);
	const llmClient = aiService.getLLMProvider({ modelConfig: llmProvider.data });
	if (node.data.json_mode) {
		const response = await aiService.getStructuredResponse({
			modelConfig: llmClient,
			prompt: prompt.data,
		});
		console.log("Response from LLM:", response);
		nodeHandleOutputMap.set(node.id, {
			data: response.object,
		});
	} else {
		const response = await aiService.getResponse({
			modelConfig: llmClient,
			prompt: prompt.data,
		});
		console.log("Response from LLM:", response);
		nodeHandleOutputMap.set(node.id, {
			data: response.content,
		});
	}
	return [];
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
			return processTextGenerationNodeHandles(
				node,
				workflowData,
				nodeHandleOutputMap,
				aiService,
			);
	}
	return [];
};
