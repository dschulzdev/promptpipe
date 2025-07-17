import { RiGeminiFill, RiOpenaiFill } from "react-icons/ri";
import type { SidebarButton } from "@/components/custom/block-sidebar";
import type { LLMProvider } from "~/ai/llm-providers";

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
