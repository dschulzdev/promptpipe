import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	workflowControllerCreateMutation,
	workflowControllerFindAllQueryKey,
} from "@/api-client/@tanstack/react-query.gen";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";

export default function AddWorkflowDialog() {
	// TODO: Add validation for the workflow name and migrate to a form
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		...workflowControllerCreateMutation(),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: workflowControllerFindAllQueryKey(),
			});
			toast.success("Workflow created successfully!");
			setOpen(false);
			setName("");
		},
		onError: (error) => {
			toast.error(`Failed to create workflow: ${error.message}`);
		},
	});
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button onClick={() => setOpen(true)}>
					<Plus className="mr-2" />
					Create New Workflow
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Create a New Workflow</DialogTitle>
				<DialogDescription>
					Please provide a name for your new workflow.
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
						onClick={() => mutate({ body: { name } })}
					>
						{isPending ? (
							<Loader2 className="mr-2 animate-spin" />
						) : (
							<Save className="mr-2" />
						)}
						Create
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
