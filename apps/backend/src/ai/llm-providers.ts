export enum LLMProviderArray {
	openai = "openai",
	google_genai = "google_genai",
}
export type LLMProvider = `${LLMProviderArray}`;

export enum GOOGLE_GENAI_MODEL {
	gemini_2_5_flash = "gemini-2.5-flash",
	gemini_2_0_flash = "gemini-2.0-flash",
	gemini_2_0_flash_lite = "gemini-2.0-flash-lite",
}

export const google_genai_models = Object.values(GOOGLE_GENAI_MODEL);

export enum OPENAI_MODEL {
	openai_4_1_mini = "4.1-mini",
	openai_4_1nano = "4.1-nano",
	openai_4_omini = "4o-mini",
}

export const openai_models = Object.values(OPENAI_MODEL);

export const LLM_MODELS = {
	openai: openai_models,
	google_genai: google_genai_models,
};

export const AllModels = [...google_genai_models, ...openai_models];
