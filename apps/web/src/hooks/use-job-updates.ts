import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import useRunnerStore from "@/stores/runner-store";
import { workflowControllerStreamUpdatesOptions } from "../api-client/@tanstack/react-query.gen";

export const useJobUpdates = () => {
	const connectedToUpdateStream = useRunnerStore(
		useShallow((state) => state.connectedToUpdateStream),
	);
	const currentRunId = useRunnerStore((state) => state.currentlyShownRunId);
	const stopWorkflow = useRunnerStore(
		useShallow((state) => state.stopWorkflow),
	);
	const setConnectedToUpdateStream = useRunnerStore(
		useShallow((state) => state.setConnectedToUpdateStream),
	);

	const queryKey = useMemo(() => {
		return workflowControllerStreamUpdatesOptions({
			path: {
				runId: currentRunId || "",
			},
		}).queryKey;
	}, [currentRunId]);
	const { data, error } = useQuery({
		enabled: !!currentRunId,
		staleTime: Number.POSITIVE_INFINITY,
		queryKey,
		initialData: [],
		queryFn: () => {
			console.log("Fetching job updates for run ID:", currentRunId);
			return [] as unknown[];
		},
	});
	const queryClient = useQueryClient();

	// biome-ignore lint/correctness/useExhaustiveDependencies: connectedToUpdateStream should not rerun the useEffect
	useEffect(() => {
		if (
			!currentRunId ||
			connectedToUpdateStream ||
			(data.length > 0 &&
				// @ts-ignore When the last log is a done type, the stream was finished and should not be resubscribed
				["result", "error", "done"].includes(data[data.length - 1].type))
		) {
			console.log(
				"No current run ID or already running, skipping SSE connection and reading from cache.",
			);
			return;
		}

		const eventSource = new EventSource(
			`${import.meta.env.VITE_SERVER_URL}/workflow/stream/${currentRunId}`,
		);

		eventSource.addEventListener("open", () => {
			console.log("SSE connection opened");
			setConnectedToUpdateStream(true);
		});

		eventSource.addEventListener("message", (event) => {
			const queryData = event.data && JSON.parse(event.data);
			queryClient.setQueriesData({ queryKey: queryKey }, (old) => [
				...(old as unknown[]),
				queryData,
			]);
			if (queryData && ["result", "error", "done"].includes(queryData.type)) {
				eventSource.close();
				setConnectedToUpdateStream(false);
				stopWorkflow();
			}
		});

		eventSource.addEventListener("error", (event) => {
			console.error("Error in SSE connection:", event);
			const queryCache = queryClient.getQueryCache();

			// Find the specific query instance
			const query = queryCache.find({ queryKey });
			query?.setState({
				status: "error",
				error: new Error("SSE connection error"),
			});
			if (eventSource.readyState === EventSource.CLOSED) {
				console.log("SSE connection closed");
				setConnectedToUpdateStream(false);
				stopWorkflow();
			}
		});

		return () => {
			eventSource.close();
			setConnectedToUpdateStream(false);
			stopWorkflow();
		};
	}, [
		currentRunId,
		queryClient.getQueryCache,
		queryClient.setQueriesData,
		stopWorkflow,
		queryKey,
		setConnectedToUpdateStream,
	]);

	return {
		data: data,
		error: error,
	} as {
		data: unknown[];
		error: Error | null;
	};
};
