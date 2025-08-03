import type { NodeTypes } from "@xyflow/react";
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
import MergeNode, {
	type MergeNodeProps,
} from "@/components/custom/nodes/processing/merge-node";
import type { MergeNodeData } from "~/workflow/dto/nodes/merge-node-data.dto";
import type { TextGenerationNodeData } from "~/workflow/dto/nodes/text-generation-node-data.dto";
import type { TextInputNodeData } from "~/workflow/dto/nodes/text-input-node-data.dto";
import type { TextOutputNodeData } from "~/workflow/dto/nodes/text-output-node-data.dto";
import type { NodeType } from "~/workflow/dto/nodes.dto";
import type { PipelineNodeDto } from "~/workflow/dto/pipeline-node.dto";
import type { LLMNodeData } from "../../../backend/src/workflow/dto/nodes/llm-node-data.dto";

export type NodeInputData =
	| LLMNodeData
	| TextGenerationNodeData
	| TextInputNodeData
	| TextGenerationNodeData
	| MergeNodeData
	| TextOutputNodeData;

export type PromptPipeNodeProps =
	| LLMNodeProps
	| TextInputNodeProps
	| TextGenerationNodeProps
	| TextOutputNodeProps
	| MergeNodeProps
	| BasicStartNodeProps;

export const nodeTypes = {
	llm: LLMNode,
	text_input: TextInputNode,
	text_generation: TextGenerationNode,
	text_output: TextOutputNode,
	basic_start: BasicStartNode,
	merge: MergeNode,
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
		case "merge":
			return {
				type: "merge",
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
