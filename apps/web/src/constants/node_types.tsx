import type { NodeTypes } from "@xyflow/react";
import BasicStartNode from "@/components/custom/nodes/basic/start-node";
import TextGenerationNode from "@/components/custom/nodes/generation/text-generation-node";
import TextInputNode, {
	type TextInputNodeData,
} from "@/components/custom/nodes/input/text-input-node";
import LLMNode from "@/components/custom/nodes/llm-node";
import TextOutputNode from "@/components/custom/nodes/output/text-output-node";
import type { TextGenerationNodeData } from "../../../backend/dist/src/workflow/dto/nodes.dto";
import type { LLMNodeData } from "../components/custom/nodes/llm-node";
import type { TextOutputNodeData } from "../components/custom/nodes/output/text-output-node";

export type NodeInputData =
	| LLMNodeData
	| TextInputNodeData
	| TextGenerationNodeData
	| TextOutputNodeData;

export const nodeTypes = {
	llm: LLMNode,
	text_input: TextInputNode,
	text_generation: TextGenerationNode,
	text_output: TextOutputNode,
	basic_start: BasicStartNode,
} satisfies NodeTypes;
