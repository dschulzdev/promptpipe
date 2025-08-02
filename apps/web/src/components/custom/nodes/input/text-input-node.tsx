import { type Node, type NodeProps, Position } from "@xyflow/react";
import { TextCursorInput } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import useNodeStore, { type LoadingStateMixin } from "@/stores/node-store";
import type { TextInputNodeData } from "~/workflow/dto/nodes/text-input-node-data.dto";

export type TextInputNodeProps = Node<
	TextInputNodeData & LoadingStateMixin,
	"text_input"
>;

function TextInputNode({ id, data }: NodeProps<TextInputNodeProps>) {
	const updateNode = useNodeStore((state) => state.updateNode);
	return (
		<NodeStatusIndicator status={data.state} variant="border">
			<BaseNode className="w-80">
				<BaseNodeHeader>
					<TextCursorInput className="h-4 w-4 text-neutral-500" />
					<BaseNodeHeaderTitle>{"Text input"}</BaseNodeHeaderTitle>
				</BaseNodeHeader>
				<BaseNodeContent>
					<Input
						value={data.prompt}
						onChange={(e) =>
							updateNode(id, {
								prompt: e.target.value,
							})
						}
					/>
				</BaseNodeContent>
				<BaseNodeFooter className="w-full px-0">
					<div className="flex w-full flex-col items-start gap-2">
						<LabeledHandle
							title={"Start trigger"}
							type="source"
							position={Position.Left}
						/>
					</div>
					<div className="flex w-full flex-col items-end gap-2">
						<LabeledHandle
							title={"Output"}
							type="target"
							position={Position.Right}
						/>
					</div>
				</BaseNodeFooter>
			</BaseNode>
		</NodeStatusIndicator>
	);
}

export default memo(TextInputNode);
