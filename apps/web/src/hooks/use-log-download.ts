import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { downloadDemoOrWorkflowLogOptions } from "./queries/demo-dependent-queries";
import { useEditorMode } from "./use-editor-mode";

export const useLogDownload = (workflowId: string, runId: string) => {
	const mode = useEditorMode();
	const query = useQuery({
		...downloadDemoOrWorkflowLogOptions(mode, runId),
		enabled: false, // Don't fetch automatically
		staleTime: Number.POSITIVE_INFINITY, // Never mark as stale → no auto-refetches
		gcTime: Number.POSITIVE_INFINITY, // Keep in cache forever (no GC)
		refetchOnWindowFocus: false, // Prevent refetch on focus
		refetchOnReconnect: false, // Prevent refetch on reconnect
		refetchOnMount: false, // Prevent refetch on component remount
	});
	useEffect(() => {
		if (query.data) {
			const link = document.createElement("a");
			link.href = query.data;
			link.download = `workflow-${workflowId}-run-${runId}-logs.json`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}, [query.data, workflowId, runId]);
	return query;
};
