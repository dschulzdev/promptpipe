import {
	Blocks,
	Brain,
	ChevronRight,
	CloudDownload,
	Database,
	DatabaseZap,
	FileArchive,
	FileJson,
	type LucideIcon,
	TextCursorInput,
	TextQuote,
} from "lucide-react";
import type { IconType } from "react-icons/lib";
import { useShallow } from "zustand/react/shallow";
import { LLMProviderButtons } from "@/constants/llm-providers";
import useNodeStore from "@/stores/node-store";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenuButton,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "../ui/sidebar";

export interface SidebarButton {
	icon: LucideIcon | IconType;
	title: string;
}

export default function BlockSidebar() {
	const inputButtons: SidebarButton[] = [
		{
			icon: TextCursorInput,
			title: "Text Input",
		},
		{
			icon: Database,
			title: "Database Table Input",
		},
		{
			icon: FileJson,
			title: "JSON Input",
		},
	];

	const outputButtons: SidebarButton[] = [
		{
			icon: TextQuote,
			title: "Text Output",
		},
		{
			icon: FileArchive,
			title: "File Output",
		},
		{
			icon: DatabaseZap,
			title: "Database Insert",
		},
		{
			icon: CloudDownload,
			title: "Third-Party-Integration",
		},
	];

	const { addLLMNode } = useNodeStore(
		useShallow((state) => ({
			addLLMNode: state.addLLMNode,
		})),
	);

	return (
		<Sidebar>
			<SidebarContent>
				<Collapsible
					key={"basic_input"}
					title={"Basic input blocks"}
					defaultOpen
					className="group/collapsible"
				>
					<SidebarGroup>
						<SidebarGroupLabel
							asChild
							className="group/label text-sidebar-foreground text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
						>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton>
									<Blocks />
									{"Basic input blocks"}
									<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenuSub>
									{inputButtons.map((item) => (
										<SidebarMenuSubItem key={item.title}>
											<SidebarMenuSubButton>
												{item.icon && <item.icon />}
												{item.title}
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							</SidebarGroupContent>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>
				<Collapsible
					key={"basic_output"}
					title={"Basic output blocks"}
					defaultOpen
					className="group/collapsible"
				>
					<SidebarGroup>
						<SidebarGroupLabel
							asChild
							className="group/label text-sidebar-foreground text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
						>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton>
									<Blocks />
									{"Basic output blocks"}
									<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenuSub>
									{outputButtons.map((item) => (
										<SidebarMenuSubItem key={item.title}>
											<SidebarMenuSubButton>
												{item.icon && <item.icon />}
												{item.title}
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							</SidebarGroupContent>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>
				<Collapsible
					key={"llm_provider"}
					title={"LLM Provider"}
					defaultOpen
					className="group/collapsible"
				>
					<SidebarGroup>
						<SidebarGroupLabel
							asChild
							className="group/label text-sidebar-foreground text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
						>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton>
									<Brain />
									{"LLM Provider"}
									<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenuSub>
									{LLMProviderButtons.map((item) => (
										<SidebarMenuSubItem key={item.title}>
											<SidebarMenuSubButton
												onClick={() => addLLMNode(item.provider)}
											>
												{item.icon && <item.icon />}
												{item.title}
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							</SidebarGroupContent>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>
			</SidebarContent>
		</Sidebar>
	);
}
