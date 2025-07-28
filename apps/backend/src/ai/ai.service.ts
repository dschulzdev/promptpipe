import type { GoogleGenerativeAIProvider } from "@ai-sdk/google";
import type { OpenAIProvider } from "@ai-sdk/openai";
import { Inject, Injectable, Logger } from "@nestjs/common";
import {
	generateObject,
	generateText,
	LanguageModel,
	UserModelMessage,
} from "ai";

type SelectedOpenAiModel = "gpt-4.1-mini" | "gpt-4o-mini" | "gpt-4.1-nano";
type SelectedGoogleGenAIModel =
	| "gemini-2.0-flash"
	| "gemini-2.5-flash"
	| "gemini-2.0-flash-lite";

@Injectable()
export class AiService {
	private readonly logger = new Logger(AiService.name);
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
					provider: "google_genai";
					model: SelectedGoogleGenAIModel;
			  };
	}): LanguageModel {
		let llm_client: GoogleGenerativeAIProvider | OpenAIProvider;
		switch (modelConfig.provider) {
			case "openai":
				llm_client = this.openaiClient;
				break;
			case "google_genai":
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
		prompt: UserModelMessage;
	}) {
		const response = await generateText({
			model: modelConfig,
			prompt: [prompt],
		});
		this.logger.log("Generated response: ", response.content);
		return response;
	}

	async getStructuredResponse({
		modelConfig,
		prompt,
	}: {
		modelConfig: LanguageModel;
		prompt: UserModelMessage;
	}): Promise<ReturnType<typeof generateObject>> {
		const response = await generateObject({
			model: modelConfig,
			prompt: [prompt],
			output: "no-schema",
		});
		this.logger.log("Generated response: ", response.object);
		return response;
	}
}
