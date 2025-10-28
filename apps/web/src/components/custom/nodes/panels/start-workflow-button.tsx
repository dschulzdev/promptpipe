import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Loader2, Play } from "lucide-react";
import { memo, useCallback } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import {
	demoControllerRunDemoWorkflowMutation,
	workflowControllerRunMutation,
} from "@/api-client/@tanstack/react-query.gen";
import { Kbd } from "@/components/ui/kbd";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { hotkeyMap, useSimpleHotkey } from "@/hooks/hotkeys";
import useSaveFileMutation from "@/hooks/mutations/use-save-file-mutation";
import { getDemoOrWorkflowOptions } from "@/hooks/queries/demo-dependent-queries";
import useEditorState from "@/stores/editor-store";
import useNodeStore from "@/stores/node-store";
import useRunnerStore from "@/stores/runner-store";
import { Button } from "../../../ui/button";

function StartWorkflowButton() {
	const { id } = useParams({ strict: false });
	const { isPending: isSaving } = useSaveFileMutation({
		// biome-ignore lint/style/noNonNullAssertion: id has to exist, when being on this screen
		id: id!,
	});
	const mode = useEditorState((state) => state.mode);
	const dirty = useEditorState((state) => state.dirty);

	const { mutate, isPending } = useMutation(workflowControllerRunMutation());
	const { mutate: demoMutate, isPending: demoIsPending } = useMutation(
		demoControllerRunDemoWorkflowMutation(),
	);
	const { isRunning, setLocalWorkflowId } = useRunnerStore(
		useShallow((state) => {
			return {
				isRunning: state.isRunning,
				setLocalWorkflowId: state.startWorkflow,
			};
		}),
	);

	const workflowInProgress = isRunning || isPending || demoIsPending;

	const handleStartWorkflow = useCallback(async () => {
		if (!id && mode !== "demo") {
			toast.error("Workflow ID is not available.");
			return;
		}
		if (mode === "demo") {
			demoMutate(
				{},
				{
					onSuccess: (data) => {
						if (data) {
							setLocalWorkflowId(data);
						}
					},
					onError: (error) => {
						toast.error(`Error starting demo workflow: ${error.message}`);
					},
				},
			);
			return;
		}
		mutate(
			{
				path: {
					workflowId: id!, // Replace with actual workflow ID if needed
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
	}, [mutate, setLocalWorkflowId, id, demoMutate, mode]);

	useSimpleHotkey(
		"run_workflow",
		() => {
			if (!isSaving && !isRunning && !isPending && !dirty) {
				handleStartWorkflow();
			}
		},
		{},
		[isRunning, isPending, isSaving, handleStartWorkflow, dirty],
	);

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					size={"default"}
					disabled={isSaving || workflowInProgress || dirty}
					onClick={handleStartWorkflow}
				>
					{workflowInProgress ? (
						<Loader2 className="h-full w-full animate-spin" />
					) : (
						<Play />
					)}
					{"Start Workflow"}
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
