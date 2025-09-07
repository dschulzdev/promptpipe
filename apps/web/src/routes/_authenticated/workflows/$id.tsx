import { DndContext } from "@dnd-kit/core";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ReactFlowProvider } from "@xyflow/react";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { workflowControllerFindOneOptions } from "@/api-client/@tanstack/react-query.gen";
import BlockSidebar from "@/components/custom/block-sidebar";
import PromptpipeWhiteboard from "@/components/custom/promptpipe-whiteboard";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import useNodeStore from "@/stores/node-store";
import type { PipelineNodeDto } from "~/workflow/dto/pipeline-node.dto";

export const Route = createFileRoute("/_authenticated/workflows/$id")({
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
	return (
		<>
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
			<Backdrop id={params.id} />
		</>
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
			// TODO: Fix types
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
