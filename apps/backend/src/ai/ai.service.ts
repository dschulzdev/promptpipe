import type { GoogleGenerativeAIProvider } from "@ai-sdk/google";
import type { OpenAIProvider } from "@ai-sdk/openai";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { OpenRouterProvider } from "@openrouter/ai-sdk-provider";
import { withTracing } from "@posthog/ai";
import {
	AssistantModelMessage,
	generateObject,
	generateText,
	LanguageModel,
	ModelMessage,
} from "ai";
import { AnalyticsService } from "src/analytics/analytics.service";

type SelectedOpenAiModel = "gpt-4.1-mini" | "gpt-4o-mini" | "gpt-4.1-nano";
type SelectedGoogleGenAIModel =
	| "gemini-2.0-flash"
	| "gemini-2.5-flash"
	| "gemini-2.0-flash-lite";
type SelectedOpenRouterModel =
	| "openrouter/horizon-beta"
	| "z-ai/glm-4.5-air:free"
	| "moonshotai/kimi-k2:free";
type ModelWithSetup = LanguageModel;

@Injectable()
export class AiService {
	private readonly logger = new Logger(AiService.name);
	constructor(
		@Inject("OPENAI_CLIENT") private openaiClient: OpenAIProvider,
		@Inject("GOOGLE_CLIENT") private googleClient: GoogleGenerativeAIProvider,
		@Inject("OPENROUTER_CLIENT") private openrouterClient: OpenRouterProvider,
		private readonly analyticsService: AnalyticsService,
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
			  }
			| {
					provider: "openrouter";
					model: SelectedOpenRouterModel;
			  };
	}): ModelWithSetup {
		let llm_client:
			| GoogleGenerativeAIProvider
			| OpenAIProvider
			| OpenRouterProvider;
		switch (modelConfig.provider) {
			case "openai":
				llm_client = this.openaiClient;
				break;
			case "google_genai":
				llm_client = this.googleClient;
				break;
			case "openrouter":
				return this.openrouterClient(modelConfig.model); // Assuming OpenRouter uses OpenAI client
			default:
				throw new Error("Unsupported provider");
		}
		return withTracing(
			llm_client(modelConfig.model),
			this.analyticsService.getClient(),
			{},
		);
	}

	async getResponse({
		modelConfig,
		messages,
	}: {
		modelConfig: ModelWithSetup;
		messages: ModelMessage[];
	}) {
		this.logger.log("Generating response with:", messages);
		this.logger.log("Using model config:", modelConfig);
		const response = await generateText({
			// @ts-ignore FIX: Type 'ModelWithSetup' is not assignable to type 'LanguageModel'.
			model: modelConfig,
			messages: messages,
		});
		this.logger.log("Generated response: ", response.text);
		const outputMessage: AssistantModelMessage = {
			role: "assistant",
			content: response.text,
		};
		return [...messages, outputMessage];
	}

	async getStructuredResponse({
		modelConfig,
		messages,
	}: {
		modelConfig: LanguageModel;
		messages: ModelMessage[];
	}): Promise<ModelMessage[]> {
		this.logger.log("Generating response with:", messages);
		const response = await generateObject({
			model: modelConfig,
			messages: messages,
			output: "no-schema",
		});
		this.logger.log("Generated response: ", response.object);
		const outputMessage: AssistantModelMessage = {
			role: "assistant",
			content: JSON.stringify(response.object),
		};
		return [...messages, outputMessage];
	}
}
