import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { WorkflowDto } from "@/api-client";
import {
	workflowControllerFindAllQueryKey,
	workflowControllerUpdateMutation,
} from "@/api-client/@tanstack/react-query.gen";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";

export default function EditWorkflowDialog({
	workflow,
	open,
	onOpenChange,
}: {
	workflow: WorkflowDto;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [name, setName] = useState(workflow.name);
	const queryClient = useQueryClient();

	useEffect(() => {
		setName(workflow.name);
	}, [workflow]);

	const { mutate, isPending } = useMutation({
		...workflowControllerUpdateMutation(),
		onSuccess: () => {
			toast.success("Workflow updated successfully!");
			queryClient.invalidateQueries({
				queryKey: workflowControllerFindAllQueryKey(),
			});
			onOpenChange(false);
		},
		onError: (error) => {
			toast.error(`Failed to update workflow: ${error.message}`);
		},
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogTitle>Edit Workflow</DialogTitle>
				<DialogDescription>
					Update the metadata of your workflow.
				</DialogDescription>
				<Input
					placeholder="Workflow Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<DialogFooter>
					<Button
						type="submit"
						disabled={isPending}
						onClick={() =>
							mutate({
								path: { id: workflow.id },
								body: { name },
							})
						}
					>
						{isPending ? (
							<Loader2 className="mr-2 animate-spin" />
						) : (
							<Save className="mr-2" />
						)}
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
