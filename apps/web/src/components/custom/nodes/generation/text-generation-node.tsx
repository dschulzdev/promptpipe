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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useNodeStore from "@/stores/node-store";

export type TextGenerationNodeData = {
	json_mode: boolean;
};

export type TextGenerationNodeProps = Node<
	TextGenerationNodeData,
	"text_generation"
>;

function TextGeneratioNode({ id, data }: NodeProps<TextGenerationNodeProps>) {
	const updateNode = useNodeStore((state) => state.updateNode);
	return (
		<BaseNode className="w-80">
			<BaseNodeHeader>
				<MessageSquare className="h-4 w-4 text-neutral-500" />
				<BaseNodeHeaderTitle>{"Text generation"}</BaseNodeHeaderTitle>
			</BaseNodeHeader>
			<BaseNodeContent>
				<div className="flex items-center space-x-2">
					<Checkbox
						id="json_mode"
						checked={data.json_mode}
						onCheckedChange={(checked) =>
							updateNode(id, {
								json_mode: Boolean(checked),
							})
						}
					/>
					<Label
						htmlFor="json_mode"
						className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						JSON Mode?
					</Label>
				</div>
			</BaseNodeContent>
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
	);
}

export default memo(TextGeneratioNode);
