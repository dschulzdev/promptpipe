import { IsBoolean } from "class-validator";
import { NodeDataDto } from "../nodes.dto";

// biome-ignore lint/suspicious/noExplicitAny: needed
export interface TextGenerationNodeData extends Record<string, any> {
	json_mode: boolean;
}

export class TextGenerationNodeDataDto
	extends NodeDataDto
	implements TextGenerationNodeData
{
	@IsBoolean()
	json_mode: boolean;
}
