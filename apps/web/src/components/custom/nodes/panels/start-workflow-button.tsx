import { useMutation } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Loader2, Play } from "lucide-react";
import { memo, useCallback } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { workflowControllerRunMutation } from "@/api-client/@tanstack/react-query.gen";
import { Kbd } from "@/components/ui/kbd";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { hotkeyMap, useSimpleHotkey } from "@/hooks/hotkeys";
import useSaveFileMutation from "@/hooks/mutations/use-save-file-mutation";
import useRunnerStore from "@/stores/runner-store";
import { Button } from "../../../ui/button";

function StartWorkflowButton() {
	const { id } = useParams({ strict: false });
	const { isPending: isSaving } = useSaveFileMutation({
		// biome-ignore lint/style/noNonNullAssertion: id has to exist, when being on this screen
		id: id!,
	});
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

	const handleStartWorkflow = useCallback(async () => {
		if (!id) {
			toast.error("Workflow ID is not available.");
			return;
		}
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
	}, [mutate, setLocalWorkflowId, id]);

	useSimpleHotkey(
		"run_workflow",
		() => {
			if (!isSaving && !isRunning && !isPending) {
				handleStartWorkflow();
			}
		},
		{},
		[isRunning, isPending, isSaving, handleStartWorkflow],
	);

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					size={"icon"}
					disabled={isSaving || workflowInProgress}
					onClick={handleStartWorkflow}
					variant={"secondary"}
				>
					{workflowInProgress ? (
						<Loader2 className="h-full w-full animate-spin" />
					) : (
						<Play />
					)}
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>
					{"Start Workflow "}
					<Kbd>{hotkeyMap.run_workflow.visualRepresentation}</Kbd>
				</p>
			</TooltipContent>
		</Tooltip>
	);
}

export default memo(StartWorkflowButton);
