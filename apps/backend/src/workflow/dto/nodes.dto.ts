import {
	IsBoolean,
	IsDefined,
	IsEnum,
	IsNotEmpty,
	IsString,
} from "class-validator";
import { LLMProvider, LLMProviderArray } from "src/ai/llm-providers";

export const NodeTypes = [
	"text_input",
	"text_generation",
	"text_output",
	"basic_start",
	"llm",
] as const;

export type NodeType = (typeof NodeTypes)[number];

export interface TextGenerationNodeData extends Record<string, any> {
	json_mode: boolean;
}

export class TextGenerationNodeDataDto implements TextGenerationNodeData {
	@IsBoolean()
	json_mode: boolean;
}

export interface TextInputNodeData extends Record<string, any> {
	prompt: string;
}

export class TextInputNodeDataDto implements TextInputNodeData {
	@IsString()
	@IsNotEmpty()
	prompt: string;
}

export interface TextOutputNodeData extends Record<string, any> {}

export class TextOutputNodeDataDto implements TextOutputNodeData {}

export interface LLMNodeData extends Record<string, any> {
	llmProvider: LLMProvider;
}

export class LLMNodeDataDto implements LLMNodeData {
	@IsEnum(LLMProviderArray)
	@IsDefined()
	llmProvider: LLMProvider;
}

export interface BasicStartNodeData extends Record<string, any> {}

export class BasicStartNodeDataDto implements BasicStartNodeData {}

export type NodeDataDto =
	| TextGenerationNodeDataDto
	| TextInputNodeDataDto
	| TextOutputNodeDataDto
	| BasicStartNodeDataDto
	| LLMNodeDataDto;
