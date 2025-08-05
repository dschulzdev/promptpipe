import { type Node, type NodeProps, Position } from "@xyflow/react";
import { GitMerge, Trash2 } from "lucide-react";
import { memo } from "react";
import {
	BaseNode,
	BaseNodeContent,
	BaseNodeFooter,
	BaseNodeHeader,
	BaseNodeHeaderTitle,
} from "@/components/base-node";
import { LabeledHandle } from "@/components/labeled-handle";
import { NodeStatusIndicator } from "@/components/node-status-indicator";
import { Button } from "@/components/ui/button";
import useNodeStore, { type LoadingStateMixin } from "@/stores/node-store";
import type { MergeNodeData } from "~/workflow/dto/nodes/merge-node-data.dto";

export type MergeNodeProps = Node<MergeNodeData & LoadingStateMixin, "merge">;

function MergeNode({ id, data }: NodeProps<MergeNodeProps>) {
	const updateNode = useNodeStore((state) => state.updateNode);

	const addInput = () => {
		const inputs = data.inputs ?? [];
		const newInput = { id: `input-${Date.now()}` };
		updateNode(id, { inputs: [...inputs, newInput] });
	};

	const removeInput = (inputId: string) => {
		const inputs = data.inputs ?? [];
		updateNode(id, { inputs: inputs.filter((i) => i.id !== inputId) });
	};

	return (
		<NodeStatusIndicator status={data.state} variant="border">
			<BaseNode className="w-80">
				<BaseNodeHeader>
					<GitMerge className="h-4 w-4 text-neutral-500" />
					<BaseNodeHeaderTitle>{"Merge"}</BaseNodeHeaderTitle>
				</BaseNodeHeader>
				<BaseNodeContent className="flex flex-col gap-4">
					<Button onClick={addInput} className="w-full" variant="secondary">
						Add Input
					</Button>
				</BaseNodeContent>
				<BaseNodeFooter className="w-full px-0">
					<div className="flex w-full flex-col items-start gap-2">
						{(data.inputs ?? []).map((input, index) => (
							<div key={input.id} className="flex items-center gap-2">
								<LabeledHandle
									title={`Input ${index + 1}`}
									type="target"
									position={Position.Left}
									id={input.id}
								/>
								<Button
									variant="ghost"
									className="h-6 w-6"
									onClick={() => removeInput(input.id)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						))}
					</div>
					<div className="flex w-full flex-col items-end gap-2">
						<LabeledHandle
							title={"Output"}
							type="source"
							position={Position.Right}
						/>
					</div>
				</BaseNodeFooter>
			</BaseNode>
		</NodeStatusIndicator>
	);
}

export default memo(MergeNode);
