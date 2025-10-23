import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Edit, MoreHorizontal, SquareDashed, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { WorkflowDto } from "@/api-client";
import {
	workflowControllerDeleteOneMutation,
	workflowControllerFindAllOptions,
	workflowControllerFindAllQueryKey,
} from "@/api-client/@tanstack/react-query.gen";
import AddWorkflowDialog from "@/components/custom/add-workflow-dialog";
import EditWorkflowDialog from "@/components/custom/edit-workflow-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/app/")({
	component: HomeComponent,
});
function HomeComponent() {
	return (
		<div className="flex h-screen w-screen flex-col items-center justify-start bg-background">
			<Navbar />
			<div className="flex w-full flex-col p-4">
				<div className="flex w-full flex-row justify-between">
					<h1 className="font-bold text-2xl">Welcome to PromptPipe</h1>
					<AddWorkflowDialog />
				</div>
			</div>
			<WorkflowList />
		</div>
	);
}

function Navbar() {
	const { signOut } = auth;
	const navigate = useNavigate();
	return (
		<nav className="flex w-full flex-row bg-sidebar p-4">
			<img
				src="/android-chrome-512x512.png"
				alt="Logo"
				className="mr-4 h-8 w-8"
			/>
			<h1 className="mr-auto font-bold text-2xl text-primary">PromptPipe</h1>
			<Button
				onClick={() =>
					signOut({}, { onSuccess: () => navigate({ to: "/login" }) })
				}
			>
				Sign Out
			</Button>
		</nav>
	);
}

function WorkflowList() {
	const { data, error, isPending } = useQuery(
		workflowControllerFindAllOptions(),
	);
	if (isPending) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Error loading workflows: {error.message}</div>;
	}
	return (
		<div className="container flex flex-row flex-wrap gap-4">
			{data?.length ? (
				data.map((workflow) => <WorkflowCard key={workflow.id} {...workflow} />)
			) : (
				<NoWorkflows />
			)}
		</div>
	);
}

function NoWorkflows() {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center">
			<SquareDashed />
			<h2 className="mt-4 mb-4 font-semibold text-lg">No Workflows Found</h2>
			<p className="mb-4 text-gray-500">
				Create your first workflow to get started.
			</p>
		</div>
	);
}

function WorkflowCard(workflow: WorkflowDto) {
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const queryClient = useQueryClient();
	const { mutate } = useMutation({
		...workflowControllerDeleteOneMutation({ path: { id: workflow.id } }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: workflowControllerFindAllQueryKey(),
			});
			toast.success("Workflow deleted successfully!");
		},
		onError: (error) => {
			toast.error(`Failed to delete workflow: ${error.message}`);
		},
	});

	return (
		<>
			<Link
				className="w-80"
				to={"/app/workflows/$id"}
				params={{ id: workflow.id }}
			>
				<Card>
					<CardHeader>
						<CardTitle>{workflow.name}</CardTitle>
						<CardAction>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant={"secondary"}
										size={"icon"}
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
									>
										<MoreHorizontal />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											setIsEditDialogOpen(true);
										}}
									>
										<Edit />
										Edit
									</DropdownMenuItem>
									<DropdownMenuItem
										className="text-destructive"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											mutate({ path: { id: workflow.id } });
										}}
									>
										<Trash className="text-destructive" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</CardAction>
					</CardHeader>
				</Card>
			</Link>
			<EditWorkflowDialog
				workflow={workflow}
				open={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}
			/>
		</>
	);
}
