import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import type {
	Options,
	UpdateWorkflowDto,
	WorkflowControllerUpdateData,
} from "@/api-client";
import { workflowControllerUpdateMutation } from "@/api-client/@tanstack/react-query.gen";
import useNodeStore from "@/stores/node-store";
import type { NodeType } from "~/workflow/dto/nodes.dto";

export default function useSaveFileMutation(
	pathProps: Options<WorkflowControllerUpdateData>["path"],
) {
	const { nodes, connections } = useNodeStore(
		useShallow((state) => ({
			nodes: state.nodes,
			connections: state.edges,
		})),
	);
	const body: UpdateWorkflowDto = {};
	const mutation = useMutation({
		...workflowControllerUpdateMutation({
			path: pathProps,
		}),
		onSuccess: () => {
			toast.success("Workflow saved successfully.");
		},
		onError: () => {
			toast.error("Error saving the workflow.");
		},
	});
	const mutate = () =>
		mutation.mutateAsync({
			path: pathProps,
			body: {
				nodes: nodes.map((n) => ({
					id: n.id,
					// TODO: fix assertion (sad i have to do it this way rn)
					type: n.type as NodeType,
					data: {
						...n.data,
						state: undefined,
					},
					position: n.position,
				})),
				connections: connections.map((c) => ({
					id: c.id,
					sourceNodeId: c.source,
					// biome-ignore lint/style/noNonNullAssertion: handleId has to exist until i get proven otherwise
					sourceNodeHandleId: c.sourceHandle!,
					targetNodeId: c.target,
					// biome-ignore lint/style/noNonNullAssertion: handleId has to exist until i get proven otherwise
					targetNodeHandleId: c.targetHandle!,
				})),
			},
		} as Options<WorkflowControllerUpdateData>);
	return { ...mutation, mutate, body };
}
