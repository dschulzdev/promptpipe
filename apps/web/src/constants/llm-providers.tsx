import { RiGeminiFill, RiOpenaiFill } from "react-icons/ri";
import type { SidebarButton } from "@/components/custom/block-sidebar";

export const LLMProviderButtons: SidebarButton[] = [
	{
		icon: RiOpenaiFill,
		title: "OpenAI",
	},
	{
		icon: RiGeminiFill,
		title: "Google GenAI",
	},
];
