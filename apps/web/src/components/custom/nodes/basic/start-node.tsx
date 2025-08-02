import { type Node, type NodeProps, Position } from "@xyflow/react";
import { PlayCircle } from "lucide-react";
import { memo } from "react";
import {
	BaseNode,
	BaseNodeFooter,
	BaseNodeHeader,
	BaseNodeHeaderTitle,
} from "@/components/base-node";
import { LabeledHandle } from "@/components/labeled-handle";
import { NodeStatusIndicator } from "@/components/node-status-indicator";
import type { LoadingStateMixin } from "@/stores/node-store";
import type { BasicStartNodeData } from "~/workflow/dto/nodes/basic-start-node-data.dto";

export type BasicStartNodeProps = Node<
	BasicStartNodeData & LoadingStateMixin,
	"basic_start"
>;

function BasicStartNode(props: NodeProps<BasicStartNodeProps>) {
	return (
		<NodeStatusIndicator status={props.data.state} variant="border">
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
							id="start"
							position={Position.Right}
						/>
					</div>
				</BaseNodeFooter>
			</BaseNode>
		</NodeStatusIndicator>
	);
}

export default memo(BasicStartNode);
