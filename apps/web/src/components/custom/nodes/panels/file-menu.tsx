import { useMutation } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Menu, Save } from "lucide-react";
import { memo } from "react";
import { toast } from "sonner";
import { workflowControllerUpdateMutation } from "@/api-client/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useNodeStore from "@/stores/node-store";
import type { NodeType } from "~/workflow/dto/nodes.dto";

function FileMenu() {
	const { id } = useParams({ strict: false });
	const { isPending, mutate } = useMutation({
		...workflowControllerUpdateMutation(),
		onSuccess: () => {
			toast.success("Workflow saved successfully.");
		},
		onError: () => {
			toast.error("Error saving the workflow.");
		},
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size={"icon"}>
					<Menu />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="start">
				<DropdownMenuLabel className="font-bold">
					File actions
				</DropdownMenuLabel>
				<DropdownMenuGroup>
					<DropdownMenuItem
						disabled={isPending}
						onClick={() => {
							if (!id) {
								toast.error("Error saving the workflow.");
								return;
							}
							const { nodes, edges: connections } = useNodeStore.getState();
							mutate({
								path: {
									// biome-ignore lint/style/noNonNullAssertion: mutation can't fire without id
									id: id!,
								},
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
							});
						}}
					>
						{isPending ? <Loader2 className="animate-spin" /> : <Save />}
						Save
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<Link to="/">
					<DropdownMenuItem>
						<ArrowLeft />
						Back to Workflow list
					</DropdownMenuItem>
				</Link>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default memo(FileMenu);
