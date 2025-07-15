import type { NodeTypes } from "@xyflow/react";
import type { TextGenerationNodeData } from "@/components/custom/nodes/generation/text-generation-node";
import TextGenerationNode from "@/components/custom/nodes/generation/text-generation-node";
import TextInputNode, {
	type TextInputNodeData,
} from "@/components/custom/nodes/input/text-input-node";
import LLMNode from "@/components/custom/nodes/llm-node";
import TextOutputNode from "@/components/custom/nodes/output/text-output-node";
import type { LLMNodeData } from "../components/custom/nodes/llm-node";

export type NodeInputData =
	| LLMNodeData
	| TextInputNodeData
	| TextGenerationNodeData;

export const nodeTypes = {
	llm: LLMNode,
	text_input: TextInputNode,
	text_generation: TextGenerationNode,
	text_output: TextOutputNode,
} satisfies NodeTypes;
