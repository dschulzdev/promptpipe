import { type Node, type NodeProps, Position } from "@xyflow/react";
import { MessageSquare } from "lucide-react";
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
import { type LoadingStateMixin } from "@/stores/node-store";
import type { TextGenerationNodeData } from "~/workflow/dto/nodes/text-generation-node-data.dto";

export type TextGenerationNodeProps = Node<
	TextGenerationNodeData & LoadingStateMixin,
	"text_generation"
>;

function TextGenerationNode({ data }: NodeProps<TextGenerationNodeProps>) {
	return (
		<NodeStatusIndicator status={data.state} variant="border">
			<BaseNode className="w-80">
				<BaseNodeHeader>
					<MessageSquare className="h-4 w-4 text-neutral-500" />
					<BaseNodeHeaderTitle>{"Text generation"}</BaseNodeHeaderTitle>
				</BaseNodeHeader>
				<BaseNodeFooter className="w-full px-0">
					<div className="flex w-full flex-col items-start gap-2">
						<LabeledHandle
							title="LLM"
							id="llm"
							type="source"
							position={Position.Left}
						/>
						<LabeledHandle
							title="Prompt"
							id="prompt"
							type="source"
							position={Position.Left}
						/>
					</div>
					<div className="flex w-full flex-col items-end gap-2">
						<LabeledHandle
							title="Output"
							type="target"
							position={Position.Right}
						/>
					</div>
				</BaseNodeFooter>
			</BaseNode>
		</NodeStatusIndicator>
	);
}

export default memo(TextGenerationNode);
