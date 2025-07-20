import { AiService } from "src/ai/ai.service";
import { LLMNodeDataDto } from "src/workflow/dto/nodes/llm-node-data.dto";
import { TextGenerationNodeDataDto } from "src/workflow/dto/nodes/text-generation-node-data.dto";
import { TextInputNodeDataDto } from "src/workflow/dto/nodes/text-input-node-data.dto";
import { TextOutputNodeDataDto } from "src/workflow/dto/nodes/text-output-node-data.dto";
import { NodeTypes } from "src/workflow/dto/nodes.dto";
import { PipelineNodeDto } from "src/workflow/dto/pipeline-node.dto";
import { RunWorkloadDto } from "src/workflow/dto/run-workflow.dto";

export type HandleDataResult = {
	key: string;
	// biome-ignore lint/suspicious/noExplicitAny: not typed yet
	data: any;
};

export function processLLMNodeHandles(
	node: LLMNodeDataDto,
	workflowData: RunWorkloadDto,
	aiService: AiService,
) {
	// Implement the logic to process LLM node handles
	return [];
}

export function processTextInputNodeHandles(
	node: TextInputNodeDataDto,
	workflowData: RunWorkloadDto,
) {
	return [];
}

export function processTextOutputNodeHandles(
	node: TextOutputNodeDataDto,
	workflowData: RunWorkloadDto,
) {
	return [];
}

export function processTextGenerationNodeHandles(
	node: TextGenerationNodeDataDto,
	workflowData: RunWorkloadDto,
) {
	return [];
}

export const processNode = async (
	node: PipelineNodeDto,
	workflowData: RunWorkloadDto,
	nodeOutputMap: Map<string, any>,
	aiService: AiService,
): Promise<Array<HandleDataResult>> => {
	switch (node.type) {
		case NodeTypes.LLM:
			return processLLMNodeHandles(node.data, workflowData, aiService);
		case NodeTypes.TEXT_INPUT:
			return processTextInputNodeHandles(node.data, workflowData);
		case NodeTypes.TEXT_OUTPUT:
			return processTextOutputNodeHandles(node.data, workflowData);
		case NodeTypes.TEXT_GENERATION:
			return processTextGenerationNodeHandles(node.data, workflowData);
	}
	return [];
};
