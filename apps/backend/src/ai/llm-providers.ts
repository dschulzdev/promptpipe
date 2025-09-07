export enum LLMProviderArray {
	openai = "openai",
	google_genai = "google_genai",
	openrouter = "openrouter",
}
export type LLMProvider = `${LLMProviderArray}`;

export enum GOOGLE_GENAI_MODEL {
	gemini_2_5_flash = "gemini-2.5-flash",
	gemini_2_5_flash_lite = "gemini-2.5-flash-lite",
	gemini_2_0_flash = "gemini-2.0-flash",
	gemini_2_0_flash_lite = "gemini-2.0-flash-lite",
}

export const google_genai_models = Object.values(GOOGLE_GENAI_MODEL);

export enum OPENAI_MODEL {
	openai_5_nano = "gpt-5-nano",
	openai_4_1_mini = "gpt-4.1-mini",
	openai_4_1nano = "gpt-4.1-nano",
	openai_4_omini = "gpt-4o-mini",
}

export const openai_models = Object.values(OPENAI_MODEL);

export enum OPENROUTER_MODEL {
	openrouter_horizon_beta = "openrouter/horizon-beta",
	openrouter_sonoma_dusk_alpha = "openrouter/sonoma-dusk-alpha",
	openrouter_sonoma_sky_alpha = "openrouter/sonoma-sky-alpha",
	openai_gpt_oss_120b_free = "openai/gpt-oss-120b:free",
	openai_gpt_oss_20b_free = "openai/gpt-oss-20b:free",
	z_ai_glm_4_5_air_free = "z-ai/glm-4.5-air:free",
	moonshotai_kimi_k2_free = "moonshotai/kimi-k2:free",
}
export const openrouter_models = Object.values(OPENROUTER_MODEL);

export const LLM_MODELS = {
	openai: openai_models,
	google_genai: google_genai_models,
	openrouter: openrouter_models,
};

export const AllModels = [
	...google_genai_models,
	...openai_models,
	...openrouter_models,
];
