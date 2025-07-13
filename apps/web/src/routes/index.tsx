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
import BlockSidebar from "@/components/custom/block-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});
function HomeComponent() {
	const initialNodes = [
		{ id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
		{ id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
	];
	const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];
	return (
		<ReactFlowProvider>
			<div className="h-max w-full">
				<SidebarProvider>
					<BlockSidebar />
					<SidebarInset>
						<ReactFlow nodes={initialNodes} edges={initialEdges}>
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
