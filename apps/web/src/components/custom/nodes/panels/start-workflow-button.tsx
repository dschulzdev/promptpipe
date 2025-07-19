import { useMutation } from "@tanstack/react-query";
import { Loader2, Play } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { workflowControllerRunMutation } from "@/api-client/@tanstack/react-query.gen";
import { mapToNodeTypeWithData, nodeTypes } from "@/constants/node_types";
import useNodeStore from "@/stores/node-store";
import useRunnerStore from "@/stores/runner-store";
import { Button } from "../../../ui/button";

export default function StartWorkflowButton() {
	const { mutate, isPending } = useMutation(workflowControllerRunMutation());
	const nodes = useNodeStore(useShallow((state) => state.nodes));
	const edges = useNodeStore(useShallow((state) => state.edges));
	const { isRunning, setLocalWorkflowId } = useRunnerStore(
		useShallow((state) => {
			return {
				isRunning: state.isRunning,
				setLocalWorkflowId: state.startWorkflow,
			};
		}),
	);

	const workflowInProgress = isRunning || isPending;

	const handleStartWorkflow = useCallback(() => {
		// TODO: Pass the actual workflow data here
		mutate(
			{
				body: {
					connections: edges.map((edge) => ({
						id: edge.id,
						sourceNodeId: edge.source,
						targetNodeId: edge.target,
						sourceNodeHandleId: edge.sourceHandle || "",
						targetNodeHandleId: edge.targetHandle || "",
					})),
					nodes: nodes.map((node) => {
						if (!node.type) {
							throw new Error("Node type is not defined");
						}
						return {
							id: node.id,
							type: node.type as keyof typeof nodeTypes,
							...mapToNodeTypeWithData(
								node.type as keyof typeof nodeTypes,
								node.data,
							),
						};
					}),
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
	}, [mutate, edges, nodes, setLocalWorkflowId]);
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
