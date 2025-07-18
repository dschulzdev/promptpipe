import type { NodeTypes } from "@xyflow/react";
import type { PipelineNodeDto } from "@/api-client";
import BasicStartNode, {
	type BasicStartNodeProps,
} from "@/components/custom/nodes/basic/start-node";
import TextGenerationNode, {
	type TextGenerationNodeProps,
} from "@/components/custom/nodes/generation/text-generation-node";
import TextInputNode, {
	type TextInputNodeProps,
} from "@/components/custom/nodes/input/text-input-node";
import LLMNode, { type LLMNodeProps } from "@/components/custom/nodes/llm-node";
import TextOutputNode, {
	type TextOutputNodeProps,
} from "@/components/custom/nodes/output/text-output-node";
import type { NodeType } from "~/workflow/dto/nodes.dto";
import type { TextGenerationNodeData } from "../../../backend/dist/src/workflow/dto/text-generation-node-data.dto";
import type { TextOutputNodeData } from "../../../backend/dist/src/workflow/dto/text-output-node-data.dto";
import type { LLMNodeData } from "../../../backend/src/workflow/dto/llm-node-data.dto";
import type { TextInputNodeData } from "../../../backend/src/workflow/dto/text-input-node-data.dto";

export type NodeInputData =
	| LLMNodeData
	| TextGenerationNodeData
	| TextInputNodeData
	| TextGenerationNodeData
	| TextOutputNodeData;

export type PromptPipeNodeProps =
	| LLMNodeProps
	| TextInputNodeProps
	| TextGenerationNodeProps
	| TextOutputNodeProps
	| BasicStartNodeProps;

export const nodeTypes = {
	llm: LLMNode,
	text_input: TextInputNode,
	text_generation: TextGenerationNode,
	text_output: TextOutputNode,
	basic_start: BasicStartNode,
} satisfies NodeTypes;

// Wow this is ugly as hell, but it works for now
// TODO: Refactor this to be more type-safe
// TODO: Maybe look for another api generator that works better with discriminated unions
export function mapToNodeTypeWithData(
	type: NodeType,
	data: NodeInputData,
): Omit<PipelineNodeDto, "id"> {
	switch (type) {
		case "llm":
			return {
				type: "llm",
				data: data,
			} as Omit<PipelineNodeDto, "id">;
		case "text_input":
			return {
				type: "text_input",
				data: data,
			} as Omit<PipelineNodeDto, "id">;
		case "text_generation":
			return {
				type: "text_generation",
				data: data,
			} as Omit<PipelineNodeDto, "id">;
		case "text_output":
			return {
				type: "text_output",
				data: {},
			} as Omit<PipelineNodeDto, "id">;
		case "basic_start":
			return {
				type: "basic_start",
				data: {},
			} as Omit<PipelineNodeDto, "id">;
		default:
			throw new Error(`Unknown node type: ${type}`);
	}
}
