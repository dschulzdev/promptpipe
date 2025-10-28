import { createFileRoute } from "@tanstack/react-router";
import { ReactFlowProvider } from "@xyflow/react";
import { Suspense } from "react";
import Joyride, { type Step } from "react-joyride";
import { demoControllerGetDemoOptions } from "@/api-client/@tanstack/react-query.gen";
import BlockSidebar from "@/components/custom/block-sidebar";
import PromptpipeWhiteboard from "@/components/custom/promptpipe-whiteboard";
import WorkflowEditorMenubar from "@/components/custom/workflow-editor-menubar";
import HistoryLayout from "@/components/layouts/history-layout";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import useEditorState from "@/stores/editor-store";
import { Backdrop } from "../app/workflows/$id";

export const Route = createFileRoute("/demo/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		useEditorState.getState().setMode("demo");
		context.queryClient.ensureQueryData(demoControllerGetDemoOptions({}));
	},
});

function RouteComponent() {
	const { selectedTab, setSelectedTab } = useEditorState();
	const steps: Step[] = [
		{
			target: "body",
			showProgress: true,
			content: "Welcome to the Promptpipe demo! Let's take a quick tour.",
			placement: "center",
		},
		{
			target: "#sidebar",
			showProgress: true,
			content: "This is the sidebar where you can find all your blocks.",
			placement: "right",
		},
		{
			target: "#tabbar",
			showProgress: true,
			content:
				"In the Tab bar you can toggle between different views for creating and managing your workflow and previous runs.",
			placement: "bottom",
		},
		{
			target: "body",
			showProgress: true,
			content: (
				<div>
					<p>This is only a demo environment. Some features are restricted: </p>
					<br />
					<ul>
						<li>
							- You can interact with the environment freely, but changes won't
							be saved.
						</li>
						<li>
							- Only the preconfigured workflow is available to run. More
							examples will be added soon.
						</li>
						<li>- You can only use the pre-configured LLM.</li>
						<li>- You cannot create an account or log in.</li>
					</ul>
					<p>Enjoy exploring Promptpipe!</p>
				</div>
			),
			placement: "center",
		},
	];
	return (
		<>
			<Joyride steps={steps} run continuous hideCloseButton />
			<Tabs value={selectedTab} onValueChange={setSelectedTab}>
				<div className="flex h-screen w-full flex-col">
					<WorkflowEditorMenubar demoMode />
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
				<Backdrop />
			</Tabs>
		</>
	);
}
