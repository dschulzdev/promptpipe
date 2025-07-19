import { IsDefined, IsEnum } from "class-validator";
import { LLMProvider, LLMProviderArray } from "src/ai/llm-providers";
import { NodeDataDto } from "../nodes.dto";

// biome-ignore lint/suspicious/noExplicitAny: needed for react flow compat
export interface LLMNodeData extends Record<string, any> {
	llmProvider: LLMProvider;
}

export class LLMNodeDataDto extends NodeDataDto implements LLMNodeData {
	@IsEnum(LLMProviderArray)
	@IsDefined()
	llmProvider: LLMProviderArray;
}
