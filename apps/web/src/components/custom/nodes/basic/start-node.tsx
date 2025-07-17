import { type Node, type NodeProps, Position } from "@xyflow/react";
import { PlayCircle, TextCursorInput } from "lucide-react";
import { memo } from "react";
import {
	BaseNode,
	BaseNodeFooter,
	BaseNodeHeader,
	BaseNodeHeaderTitle,
} from "@/components/base-node";
import { LabeledHandle } from "@/components/labeled-handle";
import type { BasicStartNodeData } from "~/workflow/dto/nodes.dto";

export type BasicStartNodeProps = Node<BasicStartNodeData, "basic_start">;

function BasicStartNode(_props: NodeProps<BasicStartNodeProps>) {
	return (
		<BaseNode className="w-32">
			<BaseNodeHeader>
				<PlayCircle className="h-4 w-4 text-neutral-500" />
				<BaseNodeHeaderTitle>{"Start"}</BaseNodeHeaderTitle>
			</BaseNodeHeader>
			<BaseNodeFooter className="w-full px-0">
				<div className="flex w-full flex-col items-end gap-2">
					<LabeledHandle
						title={"Start"}
						type="target"
						position={Position.Right}
					/>
				</div>
			</BaseNodeFooter>
		</BaseNode>
	);
}

export default memo(BasicStartNode);
