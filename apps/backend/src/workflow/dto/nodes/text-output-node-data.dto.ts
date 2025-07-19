import { NodeDataDto } from "../nodes.dto";

// biome-ignore lint/suspicious/noExplicitAny: needed
export interface TextOutputNodeData extends Record<string, any> {}

export class TextOutputNodeDataDto
	extends NodeDataDto
	implements TextOutputNodeData {}
