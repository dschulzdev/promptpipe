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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type TextOutputNodeData = {
	response: string;
};

export type TextOutputNodeProps = Node<TextOutputNodeData, "text_output">;

function TextOutputNode({ data }: NodeProps<TextOutputNodeProps>) {
	console.log(data);
	return (
		<BaseNode className="w-80">
			<BaseNodeHeader>
				<TextQuote className="h-4 w-4 text-neutral-500" />
				<BaseNodeHeaderTitle>{"Text Output"}</BaseNodeHeaderTitle>
			</BaseNodeHeader>
			<BaseNodeContent>
				<div className="grid w-full gap-3">
					<Label htmlFor="message">LLM output</Label>
					<Textarea
						placeholder="Your output will appear here"
						id="message"
						readOnly
					/>
				</div>
			</BaseNodeContent>
			<BaseNodeFooter className="w-full px-0">
				<div className="flex w-full flex-col items-start gap-2">
					<LabeledHandle
						title={"Response"}
						type="source"
						position={Position.Left}
					/>
				</div>
			</BaseNodeFooter>
		</BaseNode>
	);
}

export default memo(TextOutputNode);
