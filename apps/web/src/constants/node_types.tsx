import type { NodeTypes } from "@xyflow/react";
import LLMNode from "@/components/custom/nodes/llm-node";

export const nodeTypes = {
	llm: LLMNode,
} satisfies NodeTypes;
