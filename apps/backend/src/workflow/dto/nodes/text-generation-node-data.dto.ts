import { NodeDataDto } from "../nodes.dto";

// biome-ignore lint/suspicious/noExplicitAny: needed
export interface TextGenerationNodeData extends Record<string, any> {}

export class TextGenerationNodeDataDto
	extends NodeDataDto
	implements TextGenerationNodeData {}
