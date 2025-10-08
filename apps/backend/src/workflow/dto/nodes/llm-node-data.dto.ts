import { IsDefined, IsEnum, IsIn } from "class-validator";
import {
	AllModels,
	GOOGLE_GENAI_MODEL,
	LLMProvider,
	LLMProviderArray,
	OPENAI_MODEL,
} from "../../../ai/llm-providers";
import { NodeDataDto } from "../nodes.dto";

// biome-ignore lint/suspicious/noExplicitAny: needed for react flow compat
export interface LLMNodeData extends Record<string, any> {
	llmProvider: LLMProvider;
	llmModel: (typeof AllModels)[number];
}

export class LLMNodeDataDto extends NodeDataDto implements LLMNodeData {
	@IsEnum(LLMProviderArray)
	@IsDefined()
	llmProvider: LLMProviderArray;
	@IsIn([...Object.values(GOOGLE_GENAI_MODEL), ...Object.values(OPENAI_MODEL)])
	@IsDefined()
	llmModel: (typeof AllModels)[number];
}
