import {
	demoControllerDownloadLogForRunOptions,
	demoControllerFindHistoryOptions,
	demoControllerGetDemoOptions,
	demoControllerGetLogForHistoryOptions,
	demoControllerStreamDemoUpdatesOptions,
	workflowControllerDownloadHistoryOptions,
	workflowControllerFindHistoryOptions,
	workflowControllerFindOneOptions,
	workflowControllerGetLogForHistoryOptions,
	workflowControllerStreamUpdatesOptions,
} from "@/api-client/@tanstack/react-query.gen";
import type { EditorState } from "@/stores/editor-store";

export const getDemoOrWorkflowOptions = (
	mode: EditorState["mode"],
	id?: string,
) => {
	if (mode === "demo") {
		return demoControllerGetDemoOptions({});
	}
	return workflowControllerFindOneOptions({
		path: {
			// biome-ignore lint/style/noNonNullAssertion: id has to exist when not in demo mode
			id: id!,
		},
	});
};

export const streamDemoOrWorkflowUpdateOptions = (
	mode: EditorState["mode"],
	currentRunId: string,
) => {
	return {
		...workflowControllerStreamUpdatesOptions({
			path: {
				runId: currentRunId || "",
			},
		}),
		...(mode === "demo" &&
			demoControllerStreamDemoUpdatesOptions({
				path: {
					runId: currentRunId || "",
				},
			})),
	};
};

export const downloadDemoOrWorkflowLogOptions = (
	mode: EditorState["mode"],
	runId: string,
) => {
	return {
		...workflowControllerDownloadHistoryOptions({
			path: { runId: runId },
		}),
		...(mode === "demo" &&
			demoControllerDownloadLogForRunOptions({
				path: { runId: runId },
			})),
	};
};

export const findDemoOrWorkflowHistoryOptions = (
	mode: EditorState["mode"],
	id: string,
) => {
	if (mode === "demo") {
		// The id will never be used, but to satisfy type inference for tanstack query we act like it exists for the generation
		return demoControllerFindHistoryOptions({ path: { id: id } });
	} else {
		return workflowControllerFindHistoryOptions({ path: { id: id } });
	}
};

export const getLogForDemoOrWorkflowHistoryOptions = (
	mode: EditorState["mode"],
	id: string,
	selectedPreviousRunId: string,
) => {
	return {
		...workflowControllerGetLogForHistoryOptions({
			path: { runId: selectedPreviousRunId, id: id },
		}),
		...(mode === "demo" &&
			demoControllerGetLogForHistoryOptions({
				path: { runId: selectedPreviousRunId, id: id },
			})),
	};
};
