import type { GoogleGenerativeAIProvider } from "@ai-sdk/google";
import type { OpenAIProvider } from "@ai-sdk/openai";
import { Inject, Injectable } from "@nestjs/common";
import { generateText, LanguageModel } from "ai";

//type LooseToStrict<T> = T extends any ? (string extends T ? never : T) : never;
//type OpenAiModels = LooseToStrict<Parameters<typeof openai>[0]>;

type SelectedOpenAiModel = "gpt-4.1-mini" | "gpt-4o-mini" | "gpt-4.1-nano";
type SelectedGoogleGenAIModel =
	| "gemini-2.0-flash"
	| "gemini-2.5-flash"
	| "gemini-2.0-flash-lite";

@Injectable()
export class AiService {
	constructor(
		@Inject("OPENAI_CLIENT") private openaiClient: OpenAIProvider,
		@Inject("GOOGLE_CLIENT") private googleClient: GoogleGenerativeAIProvider,
	) {}

	getLLMProvider({
		modelConfig,
	}: {
		modelConfig:
			| {
					provider: "openai";
					model: SelectedOpenAiModel;
			  }
			| {
					provider: "google";
					model: SelectedGoogleGenAIModel;
			  };
	}): LanguageModel {
		let llm_client: GoogleGenerativeAIProvider | OpenAIProvider;
		switch (modelConfig.provider) {
			case "openai":
				llm_client = this.openaiClient;
				break;
			case "google":
				llm_client = this.googleClient;
				break;
			default:
				throw new Error("Unsupported provider");
		}
		return llm_client(modelConfig.model);
	}

	async getResponse({
		modelConfig,
		prompt,
	}: {
		modelConfig: LanguageModel;
		prompt: string;
	}) {
		return await generateText({
			model: modelConfig,
			prompt,
		});
	}
}
