import { memo, type PropsWithChildren } from "react";
import LogSheet from "./log-sheet";
import StartWorkflowButton from "./start-workflow-button";

export const WorkflowButtonGroup = memo(() => {
	return (
		<WorkflowButtonGroupWrapper>
			<LogSheet />
			<StartWorkflowButton />
		</WorkflowButtonGroupWrapper>
	);
});

export default WorkflowButtonGroup;

export const WorkflowButtonGroupWrapper = ({ children }: PropsWithChildren) => {
	return (
		<div className="dark: flex flex-row gap-4 rounded-2xl bg-card bg-neu p-4 shadow-2xl">
			{children}
		</div>
	);
};
