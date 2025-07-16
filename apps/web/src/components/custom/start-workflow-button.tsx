import { useMutation } from "@tanstack/react-query";
import { Loader2, Play } from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { workflowControllerRunMutation } from "@/api-client/@tanstack/react-query.gen";
import useRunnerStore from "@/stores/runner-store";
import { Button } from "../ui/button";

export default function StartWorkflowButton() {
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

	function handleStartWorkflow() {
		// TODO: Pass the actual workflow data here
		mutate(
			{},
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
	}
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
