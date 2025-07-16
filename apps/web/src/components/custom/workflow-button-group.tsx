import { memo } from "react";
import LogSheet from "./log-sheet";
import StartWorkflowButton from "./start-workflow-button";

export const WorkflowButtonGroup = memo(() => {
	return (
		<div className="flex flex-row gap-4 rounded-2xl bg-neutral-200 p-4 shadow-2xl">
			<LogSheet />
			<StartWorkflowButton />
		</div>
	);
});

export default WorkflowButtonGroup;
