import { IsArray } from "class-validator";
import { NodeDataDto } from "../nodes.dto";

// biome-ignore lint/suspicious/noExplicitAny: needed
export interface MergeNodeData extends Record<string, any> {
	inputs: { id: string }[];
}

export class MergeNodeDataDto extends NodeDataDto implements MergeNodeData {
	@IsArray()
	inputs: { id: string }[];
}
