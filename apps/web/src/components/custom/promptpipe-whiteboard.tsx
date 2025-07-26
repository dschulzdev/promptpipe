import {
	Background,
	BackgroundVariant,
	type Connection,
	Controls,
	type Edge,
	type EdgeTypes,
	getOutgoers,
	MiniMap,
	type Node,
	Panel,
	ReactFlow,
} from "@xyflow/react";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { nodeTypes } from "@/constants/node_types";
import { useJobUpdates } from "@/hooks/use-job-updates";
import type { NodeActions, NodeState } from "@/stores/node-store";
import useNodeStore from "@/stores/node-store";
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
			nodes={nodes}
			edges={edges}
			nodeTypes={nodeTypes}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onConnect={onConnect}
			isValidConnection={isValidConnection}
			fitView
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
