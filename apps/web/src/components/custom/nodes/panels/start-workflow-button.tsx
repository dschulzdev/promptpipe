import { useMutation } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Loader2, Play } from "lucide-react";
import { memo, useCallback } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { workflowControllerRunMutation } from "@/api-client/@tanstack/react-query.gen";
import useRunnerStore from "@/stores/runner-store";
import { Button } from "../../../ui/button";

function StartWorkflowButton() {
	const { id } = useParams({ strict: false });
	const { mutate, isPending } = useMutation(workflowControllerRunMutation());
	const { isRunning, setLocalWorkflowId } = useRunnerStore(
		useShallow((state) => {
			return {
				isRunning: state.isRunning,
				setLocalWorkflowId: state.startWorkflow,
			};
		}),
	);

	const workflowInProgress = isRunning || isPending;

	const handleStartWorkflow = useCallback(() => {
		if (!id) {
			toast.error("Workflow ID is not available.");
			return;
		}
		// TODO: Pass the actual workflow data here
		mutate(
			{
				path: {
					workflowId: id, // Replace with actual workflow ID if needed
				},
			},
			{
				onSuccess: (data) => {
					if (data) {
						setLocalWorkflowId(data);
					}
				},
				onError: (error) => {
					toast.error(`Error starting workflow:${error.message}`);
				},
			},
		);
	}, [mutate, setLocalWorkflowId]);
	return (
		<Button
			size={"icon"}
			disabled={workflowInProgress}
			onClick={handleStartWorkflow}
		>
			{workflowInProgress ? <Loader2 className="animate-spin" /> : <Play />}
		</Button>
	);
}

export default memo(StartWorkflowButton);
