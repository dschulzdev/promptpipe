import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";
import { NodeDataDto } from "../nodes.dto";

class MergeInput {
	@IsString()
	id: string;
}

// biome-ignore lint/suspicious/noExplicitAny: needed
export interface MergeNodeData extends Record<string, any> {
	inputs: { id: string }[];
}

export class MergeNodeDataDto extends NodeDataDto implements MergeNodeData {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => MergeInput)
	inputs: MergeInput[];
}
