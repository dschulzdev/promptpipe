import { RiGeminiFill, RiOpenaiFill } from "react-icons/ri";
import type { SidebarButton } from "@/components/custom/block-sidebar";

export type LLMProvider = "openai" | "google_genai";

export const LLMProviderButtons: (SidebarButton & { provider: LLMProvider })[] =
	[
		{
			icon: RiOpenaiFill,
			title: "OpenAI",
			provider: "openai",
		},
		{
			icon: RiGeminiFill,
			title: "Google GenAI",
			provider: "google_genai",
		},
	];
