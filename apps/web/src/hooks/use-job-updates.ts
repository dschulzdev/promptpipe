import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import useNodeStore from "@/stores/node-store";
import useRunnerStore from "@/stores/runner-store";
import type {
	ProgressMessage,
	ProgressMessageWithType,
	ProgressType,
} from "../../../backend/src/runner/progress-message";
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
	const updateNode = useNodeStore(useShallow((state) => state.updateNode));
	const { data, error } = useQuery<
		ProgressMessageWithType[],
		Error,
		ProgressMessageWithType[]
	>({
		enabled: !!currentRunId,
		staleTime: Number.POSITIVE_INFINITY,
		queryKey,
		initialData: [],
		queryFn: () => {
			console.log("Fetching job updates for run ID:", currentRunId);
			return [] as ProgressMessageWithType[];
		},
	});
	const queryClient = useQueryClient();

	// biome-ignore lint/correctness/useExhaustiveDependencies: connectedToUpdateStream should not rerun the useEffect
	useEffect(() => {
		if (
			!currentRunId ||
			connectedToUpdateStream ||
			(data &&
				data.length > 0 &&
				["result_success", "result_fail", "error", "done"].includes(
					data[data.length - 1]?.type,
				))
		) {
			console.log(
				"No current run ID or already running, skipping SSE connection and reading from cache.",
			);
			return;
		}

		const eventSource = new EventSource(
			`${import.meta.env.VITE_SERVER_URL}/workflow/stream/${currentRunId}`,
			{ withCredentials: true },
		);

		eventSource.addEventListener("open", () => {
			console.log("SSE connection opened");
			setConnectedToUpdateStream(true);
			useNodeStore.setState((state) => ({
				nodes: state.nodes.map((node) => ({
					...node,
					data: {
						...node.data,
						state: "initial",
					},
				})),
			}));
		});

		eventSource.addEventListener("message", (event) => {
			let queryData: {
				type: ProgressType;
				payload: ProgressMessage;
			};
			try {
				queryData = event.data && JSON.parse(event.data);
			} catch (error) {
				console.error("Failed to parse SSE message:", error);
				return;
			}

			queryClient.setQueriesData({ queryKey: queryKey }, (old) => [
				...(old as unknown[]),
				queryData,
			]);
			if (queryData.type === "progress_node") {
				if (queryData.payload.payload?.nodeId) {
					updateNode(queryData.payload.payload?.nodeId, {
						state: "loading",
					});
				}
			}
			if (queryData.type === "success_node") {
				if (queryData.payload.payload?.nodeId) {
					console.log("Node success:", queryData.payload.payload.data);
					updateNode(queryData.payload.payload.nodeId, {
						state: "success",
						...(queryData.payload.payload.data ?? undefined),
					});
				}
			}
			if (
				queryData &&
				["result_success", "result_fail", "error", "done"].includes(
					queryData.type,
				)
			) {
				const nodes = useNodeStore.getState().nodes;
				useNodeStore.setState({
					nodes: nodes.map((node) => ({
						...node,
						data: {
							...node.data,
							state:
								node.data.state === "loading"
									? queryData.type === "result_success"
										? "success"
										: "error"
									: node.data.state,
						},
					})),
				});
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
