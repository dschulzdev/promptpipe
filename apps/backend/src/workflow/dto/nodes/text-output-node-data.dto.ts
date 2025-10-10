import type { ModelMessage } from "ai";
import { IsArray, IsOptional } from "class-validator";
import { NodeDataDto } from "../nodes.dto";

// biome-ignore lint/suspicious/noExplicitAny: needed
export interface TextOutputNodeData extends Record<string, any> {
	response: Array<ModelMessage>;
}

export class TextOutputNodeDataDto
	extends NodeDataDto
	implements TextOutputNodeData
{
	@IsArray()
	@IsOptional()
	response: Array<ModelMessage> = [];
}
