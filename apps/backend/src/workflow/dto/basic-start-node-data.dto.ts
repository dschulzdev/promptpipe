import { NodeDataDto } from "./nodes.dto";

// biome-ignore lint/suspicious/noExplicitAny: needed
export interface BasicStartNodeData extends Record<string, any> {}

export class BasicStartNodeDataDto
	extends NodeDataDto
	implements BasicStartNodeData {}
