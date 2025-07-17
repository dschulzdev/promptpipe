export const LLMProviderArray = ["openai", "google_genai"] as const;
export type LLMProvider = (typeof LLMProviderArray)[number];

export const google_genai_models = [
	"gemini-2.5-flash",
	"gemini-2.0-flash",
	"gemini-2.0-flash-lite",
];

export const openai_models = ["4.1-mini", "4.1-nano", "4o-mini"];

export const LLM_MODELS = {
	openai: openai_models,
	google_genai: google_genai_models,
};
