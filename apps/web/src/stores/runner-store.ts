import { create } from "zustand";

export type RunnerState = {
	isRunning: boolean;
	connectedToUpdateStream: boolean;
	currentlyShownRunId: string | null;
};

export type RunnerActions = {
	startWorkflow: (runId: string) => void;
	stopWorkflow: () => void;
	setConnectedToUpdateStream: (connected: boolean) => void;
};

const defaultValues: RunnerState = {
	isRunning: false,
	connectedToUpdateStream: false,
	currentlyShownRunId: null,
};

const useRunnerStore = create<RunnerState & RunnerActions>((set, _) => ({
	...defaultValues,
	startWorkflow: (runId) => {
		set({ currentlyShownRunId: runId, isRunning: true });
	},
	setConnectedToUpdateStream: (value) => {
		set({ connectedToUpdateStream: value });
	},
	stopWorkflow: () => {
		set({ isRunning: false, connectedToUpdateStream: false });
	},
}));

export default useRunnerStore;
