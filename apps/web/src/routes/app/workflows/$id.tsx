import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ReactFlowProvider } from "@xyflow/react";
import { Loader2 } from "lucide-react";
import { Suspense, useEffect } from "react";
import { workflowControllerFindOneOptions } from "@/api-client/@tanstack/react-query.gen";
import BlockSidebar from "@/components/custom/block-sidebar";
import PromptpipeWhiteboard from "@/components/custom/promptpipe-whiteboard";
import WorkflowEditorMenubar from "@/components/custom/workflow-editor-menubar";
import HistoryLayout from "@/components/layouts/history-layout";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import useEditorState from "@/stores/editor-store";
import useNodeStore from "@/stores/node-store";
import type { PipelineNodeDto } from "~/workflow/dto/pipeline-node.dto";

export const Route = createFileRoute("/app/workflows/$id")({
	component: RouteComponent,
	loader: async ({ context, params }) => {
		context.queryClient.ensureQueryData(
			workflowControllerFindOneOptions({
				path: {
					id: params.id,
				},
			}),
		);
	},
});

function RouteComponent() {
	const params = Route.useParams();
	const { selectedTab, setSelectedTab } = useEditorState();
	return (
		<Tabs value={selectedTab} onValueChange={setSelectedTab}>
			<div className="flex h-screen w-full flex-col">
				<WorkflowEditorMenubar />
				<div className="relative flex-1 overflow-hidden">
					<ReactFlowProvider>
						<TabsContent value="editor">
							<SidebarProvider>
								<BlockSidebar />
								<SidebarInset>
									<PromptpipeWhiteboard />
								</SidebarInset>
							</SidebarProvider>
						</TabsContent>
					</ReactFlowProvider>
					<TabsContent value="history" className="h-full">
						<Suspense fallback={<div>Loading...</div>}>
							<HistoryLayout />
						</Suspense>
					</TabsContent>
					<TabsContent value="evaluations">
						<div className="flex h-full w-full items-center justify-center">
							<p>Evaluations content goes here.</p>
						</div>
					</TabsContent>
				</div>
			</div>
			<Backdrop id={params.id} />
		</Tabs>
	);
}

function Backdrop({ id }: { id: string }) {
	const { data, isPending, isSuccess, error, refetch } = useQuery({
		...workflowControllerFindOneOptions({
			path: {
				id: id,
			},
		}),
	});
	const initData = useNodeStore((state) => state.initData);

	useEffect(() => {
		if (isSuccess && data) {
			initData(data.nodes as unknown as PipelineNodeDto[], data.connections);
		}
	}, [isSuccess, initData, data]);

	if (!isPending && isSuccess) {
		return null;
	}
	return (
		<div
			className={`fixed inset-0 z-50 grid h-screen w-screen place-items-center ${isPending && !isSuccess ? "bg-black/50 backdrop-blur-sm" : ""}`}
		>
			{error && (
				<div className="flex flex-col gap-4 text-white">
					<p>Error loading workflow: {error.message}</p>
					<Button
						onClick={() => refetch()}
						className="mt-2 rounded bg-white px-4 py-2 text-black"
					>
						Retry
					</Button>
				</div>
			)}
			{isPending && <Loader2 className="h-12 w-12 animate-spin text-white" />}
		</div>
	);
}
