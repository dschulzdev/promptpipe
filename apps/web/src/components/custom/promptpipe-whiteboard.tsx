import {
	Background,
	BackgroundVariant,
	Controls,
	MiniMap,
	Panel,
	ReactFlow,
} from "@xyflow/react";
import { FileIcon, Menu, SidebarClose } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { nodeTypes } from "@/constants/node_types";
import { useJobUpdates } from "@/hooks/use-job-updates";
import type { NodeActions, NodeState } from "@/stores/node-store";
import useNodeStore from "@/stores/node-store";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarTrigger } from "../ui/sidebar";
import FileMenu from "./nodes/panels/file-menu";
import SidebarToggle from "./nodes/panels/sidebar-toggle";
import {
	WorkflowButtonGroup,
	WorkflowButtonGroupWrapper,
} from "./nodes/panels/workflow-button-group";

export default function PromptpipeWhiteboard() {
	void useJobUpdates();
	const selector = (state: NodeState & NodeActions) => ({
		nodes: state.nodes,
		edges: state.edges,
		onNodesChange: state.onNodesChange,
		onEdgesChange: state.onEdgesChange,
		onConnect: state.onConnect,
	});
	const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
		useNodeStore(useShallow(selector));
	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			nodeTypes={nodeTypes}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onConnect={onConnect}
			fitView
			snapToGrid
		>
			<Controls />
			<Panel position={"top-left"}>
				<WorkflowButtonGroupWrapper>
					<FileMenu />
					<SidebarToggle />
				</WorkflowButtonGroupWrapper>
			</Panel>
			<Panel position={"top-right"}>
				<WorkflowButtonGroup />
			</Panel>
			<MiniMap />
			<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
		</ReactFlow>
	);
}
