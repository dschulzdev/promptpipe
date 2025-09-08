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

export type StructuredOutputNodeProps = Node<
	TextGenerationNodeData & LoadingStateMixin,
	"structured_output"
>;

function StructuredOutputNode({ data }: NodeProps<StructuredOutputNodeProps>) {
	return (
		<NodeStatusIndicator status={data.state} variant="border">
			<BaseNode className="w-80">
				<BaseNodeHeader>
					<MessageSquare className="h-4 w-4 text-neutral-500" />
					<BaseNodeHeaderTitle>{"Structured Output"}</BaseNodeHeaderTitle>
				</BaseNodeHeader>
				<BaseNodeContent>
					<div className="flex flex-col gap-2">
						<p className="text-muted-foreground text-sm">
							{
								"This node generates structured output based on the provided prompt."
							}
						</p>
					</div>
				</BaseNodeContent>
				<BaseNodeFooter className="w-full px-0">
					<div className="flex w-full flex-col items-start gap-2">
						<LabeledHandle
							title="LLM"
							id="llm"
							type="target"
							position={Position.Left}
						/>
						<LabeledHandle
							title="Prompt"
							id="prompt"
							type="target"
							position={Position.Left}
						/>
					</div>
					<div className="flex w-full flex-col items-end gap-2">
						<LabeledHandle
							title="Output"
							type="source"
							position={Position.Right}
						/>
					</div>
				</BaseNodeFooter>
			</BaseNode>
		</NodeStatusIndicator>
	);
}

export default memo(StructuredOutputNode);
