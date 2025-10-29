import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import {
	Background,
	BackgroundVariant,
	type Connection,
	type Edge,
	getOutgoers,
	type Node,
	Panel,
	ReactFlow,
} from "@xyflow/react";
import { ArchiveRestore } from "lucide-react";
import { Suspense, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { nodeTypes } from "@/constants/node_types";
import { hotkeyMap, useSimpleHotkey } from "@/hooks/hotkeys";
import { getDemoOrWorkflowOptions } from "@/hooks/queries/demo-dependent-queries";
import { useJobUpdates } from "@/hooks/use-job-updates";
import useEditorState from "@/stores/editor-store";
import type { NodeActions, NodeState } from "@/stores/node-store";
import useNodeStore from "@/stores/node-store";
import useRunnerStore from "@/stores/runner-store";
import type { PipelineNodeDto } from "~/workflow/dto/pipeline-node.dto";
import { Button } from "../ui/button";
import { Kbd } from "../ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
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
	const isRunning = useRunnerStore(useShallow((state) => state.isRunning));

	const isValidConnection = useCallback(
		(connection: Edge | Connection) => {
			// we are using getNodes and getEdges helpers here
			// to make sure we create isValidConnection function only once
			const target = nodes.find((node) => node.id === connection.target);
			const source = nodes.find((node) => node.id === connection.source);
			if (!source || !target) {
				return false;
			}
			if (target.id === connection.source) return false;

			if (target.type === "llm" && connection.sourceHandle !== "llm") {
				return false;
			}

			if (connection.sourceHandle === "llm" && target.type !== "llm") {
				return false;
			}

			const hasCycle = (node: Node, visited = new Set()) => {
				if (visited.has(node.id)) return false;

				visited.add(node.id);

				for (const outgoer of getOutgoers(node, nodes, edges)) {
					if (outgoer.id === connection.source) return true;
					if (hasCycle(outgoer, visited)) return true;
				}
			};

			return !hasCycle(target);
		},
		[nodes, edges],
	);
	return (
		<ReactFlow
			nodesConnectable={!isRunning}
			nodesDraggable={!isRunning}
			nodesFocusable={!isRunning}
			edgesFocusable={!isRunning}
			nodes={nodes}
			edges={edges}
			nodeTypes={nodeTypes}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onConnect={onConnect}
			isValidConnection={isValidConnection}
			fitView
			proOptions={{ hideAttribution: true }}
		>
			<Panel position={"top-left"}>
				<WorkflowButtonGroupWrapper>
					<SidebarToggle />
					<Suspense>
						<ResetButton />
					</Suspense>
				</WorkflowButtonGroupWrapper>
			</Panel>
			<Panel position={"top-right"}>
				<WorkflowButtonGroup />
			</Panel>
			<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
		</ReactFlow>
	);
}

function ResetButton() {
	const { id } = useParams({ strict: false });
	const mode = useEditorState((state) => state.mode);
	const queryOptions = getDemoOrWorkflowOptions(mode, id);
	//@ts-expect-error
	const { data } = useSuspenseQuery(queryOptions);
	const initData = useNodeStore((state) => state.initData);

	const resetToLastSavedState = () =>
		initData(data.nodes as unknown as PipelineNodeDto[], data.connections);

	useSimpleHotkey(
		"resetToLastSavedState",
		() => {
			resetToLastSavedState();
		},
		{},
		[resetToLastSavedState],
	);

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					size={"icon"}
					variant={"secondary"}
					onClick={resetToLastSavedState}
				>
					<ArchiveRestore />
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>
					Reset to Last Saved State{" "}
					<Kbd>{hotkeyMap.resetToLastSavedState.visualRepresentation}</Kbd>
				</p>
			</TooltipContent>
		</Tooltip>
	);
}
