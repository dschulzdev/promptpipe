import { IsNotEmpty, IsString } from "class-validator";
import { NodeDataDto } from "./nodes.dto";

// biome-ignore lint/suspicious/noExplicitAny: needed
export interface TextInputNodeData extends Record<string, any> {
	prompt: string;
}

export class TextInputNodeDataDto
	extends NodeDataDto
	implements TextInputNodeData
{
	@IsString()
	@IsNotEmpty()
	prompt: string;
}
