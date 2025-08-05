import { type Node, type NodeProps, Position } from "@xyflow/react";
import { TextQuote } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import type { LoadingStateMixin } from "@/stores/node-store";
import type { TextOutputNodeData } from "~/workflow/dto/nodes/text-output-node-data.dto";

export type TextOutputNodeProps = Node<
	TextOutputNodeData & LoadingStateMixin,
	"text_output"
>;

function TextOutputNode(props: NodeProps<TextOutputNodeProps>) {
	return (
		<NodeStatusIndicator status={props.data.state} variant="border">
			<BaseNode className="w-80">
				<BaseNodeHeader>
					<TextQuote className="h-4 w-4 text-neutral-500" />
					<BaseNodeHeaderTitle>{"Text Output"}</BaseNodeHeaderTitle>
				</BaseNodeHeader>
				<BaseNodeContent>
					<div className="grid h-72 w-full gap-3">
						<Label htmlFor="message">LLM output</Label>
						<div className="nowheel h-64 overflow-y-auto rounded border bg-background p-3">
							<p className="whitespace-pre-wrap">
								{props.data.response?.at(-1)?.content?.toString() ||
									"Your output will appear here"}
							</p>
						</div>
					</div>
				</BaseNodeContent>
				<BaseNodeFooter className="w-full px-0">
					<div className="flex w-full flex-col items-start gap-2">
						<LabeledHandle
							title={"Response"}
							type="target"
							position={Position.Left}
						/>
					</div>
				</BaseNodeFooter>
			</BaseNode>
		</NodeStatusIndicator>
	);
}

export default memo(TextOutputNode);
