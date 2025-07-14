import { createFileRoute } from "@tanstack/react-router";
import {
	Background,
	BackgroundVariant,
	Controls,
	MiniMap,
	Panel,
	ReactFlow,
	ReactFlowProvider,
} from "@xyflow/react";
import { Play } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import BlockSidebar from "@/components/custom/block-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { nodeTypes } from "@/constants/node_types";
import useNodeStore, { type AppState } from "../stores/node-store";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});
function HomeComponent() {
	const selector = (state: AppState) => ({
		nodes: state.nodes,
		edges: state.edges,
		onNodesChange: state.onNodesChange,
		onEdgesChange: state.onEdgesChange,
		onConnect: state.onConnect,
	});
	const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
		useNodeStore(useShallow(selector));

	return (
		<ReactFlowProvider>
			<div className="h-max w-full">
				<SidebarProvider>
					<BlockSidebar />
					<SidebarInset>
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
							<Panel position={"top-right"}>
								<div className="rounded-2xl bg-neutral-100 shadow-2xl">
									<Button size={"icon"}>
										<Play />
									</Button>
								</div>
							</Panel>
							<MiniMap />
							<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
						</ReactFlow>
					</SidebarInset>
				</SidebarProvider>
			</div>
		</ReactFlowProvider>
	);
}
