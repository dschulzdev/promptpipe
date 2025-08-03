import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { NodeDataDto } from "../nodes.dto";

enum LLMMessageRoleEnum {
	user = "user",
	assistant = "assistant",
	system = "system",
}

export type LLMMessageRole = keyof typeof LLMMessageRoleEnum;

// biome-ignore lint/suspicious/noExplicitAny: needed
export interface TextInputNodeData extends Record<string, any> {
	role: LLMMessageRole;
	prompt: string;
}

export class TextInputNodeDataDto
	extends NodeDataDto
	implements TextInputNodeData
{
	@IsEnum(LLMMessageRoleEnum)
	@IsNotEmpty()
	role: LLMMessageRole;

	@IsString()
	@IsNotEmpty()
	prompt: string;
}
