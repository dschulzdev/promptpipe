import {
	Blocks,
	Brain,
	ChevronRight,
	CirclePlay,
	GitMerge,
	Loader,
	type LucideIcon,
	MessageSquare,
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

interface SidebarButtonWithAction extends SidebarButton {
	action: () => Promise<void> | void;
}

export default function BlockSidebar() {
	const {
		addLLMNode,
		addTextInputNode,
		addTextGenerationNode,
		addTextOutputNode,
		addBasicStartNode,
		addMergeNode,
		addStructuredOutputNode,
	} = useNodeStore(
		useShallow((state) => ({
			addLLMNode: state.addLLMNode,
			addTextInputNode: state.addTextInputNode,
			addTextGenerationNode: state.addTextGenerationNode,
			addTextOutputNode: state.addTextOutputNode,
			addBasicStartNode: state.addBasicStartNode,
			addMergeNode: state.addMergeNode,
			addStructuredOutputNode: state.addStructuredOutputNode,
		})),
	);

	const inputButtons: SidebarButtonWithAction[] = [
		{
			icon: TextCursorInput,
			title: "Text Input",
			action: addTextInputNode,
		},
	];

	const outputButtons: SidebarButtonWithAction[] = [
		{
			icon: TextQuote,
			title: "Text Output",
			action: addTextOutputNode,
		},
	];

	const processingButtons: SidebarButtonWithAction[] = [
		{
			icon: GitMerge,
			title: "Merge",
			action: addMergeNode,
		},
	];

	return (
		// biome-ignore lint/correctness/useUniqueElementIds: id needed for react joyride targeting
		<Sidebar id="sidebar">
			<SidebarContent>
				<Collapsible
					key={"basic"}
					title={"Basic blocks"}
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
									{"Basic blocks"}
									<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenuSub>
									<SidebarMenuSubItem key={"basic_start"}>
										<SidebarMenuSubButton onClick={addBasicStartNode}>
											<CirclePlay />
											{"Basic Start"}
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
								</SidebarMenuSub>
							</SidebarGroupContent>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>
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
											<SidebarMenuSubButton onClick={item.action}>
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
											<SidebarMenuSubButton onClick={item.action}>
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
					key={"processing"}
					title={"Processing blocks"}
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
									{"Processing blocks"}
									<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenuSub>
									{processingButtons.map((item) => (
										<SidebarMenuSubItem key={item.title}>
											<SidebarMenuSubButton onClick={item.action}>
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
				<Collapsible
					key={"Response generation"}
					title={"Response generation"}
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
									<Loader />
									{"Response generation"}
									<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenuSub>
									<SidebarMenuSubItem key={"Text generation"}>
										<SidebarMenuSubButton
											onClick={() => {
												addTextGenerationNode();
											}}
										>
											<MessageSquare />
											{"Text generation"}
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
									<SidebarMenuSubItem key={"Structured output"}>
										<SidebarMenuSubButton
											onClick={() => {
												addStructuredOutputNode();
											}}
										>
											<MessageSquare />
											{"Structured output"}
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
								</SidebarMenuSub>
							</SidebarGroupContent>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>
			</SidebarContent>
		</Sidebar>
	);
}
