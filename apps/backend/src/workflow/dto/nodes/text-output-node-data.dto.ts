import type { ModelMessage } from "ai";
import { NodeDataDto } from "../nodes.dto";

// biome-ignore lint/suspicious/noExplicitAny: needed
export interface TextOutputNodeData extends Record<string, any> {
	response: Array<ModelMessage>;
}

export class TextOutputNodeDataDto
	extends NodeDataDto
	implements TextOutputNodeData
{
	response: Array<ModelMessage> = [];
}
