import { IsNotEmpty, IsString } from "class-validator";

export interface TextInputNodeData extends Record<string, any> {
	prompt: string;
}

export class TextInputNodeDataDto implements TextInputNodeData {
	@IsString()
	@IsNotEmpty()
	prompt: string;
}
