import { createFileRoute } from "@tanstack/react-router";
import { ReactFlowProvider } from "@xyflow/react";
import BlockSidebar from "@/components/custom/block-sidebar";
import PromptpipeWhiteboard from "@/components/custom/promptpipe-whiteboard";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});
function HomeComponent() {
	return (
		<ReactFlowProvider>
			<div className="h-max w-full">
				<SidebarProvider>
					<BlockSidebar />
					<SidebarInset>
						<PromptpipeWhiteboard />
					</SidebarInset>
				</SidebarProvider>
			</div>
		</ReactFlowProvider>
	);
}
