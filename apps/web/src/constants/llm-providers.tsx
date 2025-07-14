import { RiGeminiFill, RiOpenaiFill } from "react-icons/ri";
import type { SidebarButton } from "@/components/custom/block-sidebar";

export type LLMProvider = "openai" | "google_genai";

export const LLMProviderRenderMap: Record<LLMProvider, SidebarButton> = {
	openai: {
		title: "OpenAI",
		icon: RiOpenaiFill,
	},
	google_genai: {
		title: "Google GenAI",
		icon: RiGeminiFill,
	},
};

export const LLMProviderButtons: (SidebarButton & { provider: LLMProvider })[] =
	[
		{
			provider: "openai",
			...LLMProviderRenderMap.openai,
		},
		{
			provider: "google_genai",
			...LLMProviderRenderMap.google_genai,
		},
	];

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
