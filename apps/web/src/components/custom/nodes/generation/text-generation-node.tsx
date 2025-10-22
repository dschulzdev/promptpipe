import { type Node, type NodeProps, Position } from "@xyflow/react";
import { MessageSquare, RefreshCcw } from "lucide-react";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useNodeStore, { type LoadingStateMixin } from "@/stores/node-store";
import type { TextGenerationNodeData } from "~/workflow/dto/nodes/text-generation-node-data.dto";

export type TextGenerationNodeProps = Node<
	TextGenerationNodeData & LoadingStateMixin,
	"text_generation"
>;

function TextGenerationNode({ id, data }: NodeProps<TextGenerationNodeProps>) {
	const { updateNode, replaceNode } = useNodeStore(
		useShallow((state) => ({
			updateNode: state.updateNode,
			replaceNode: state.replaceNode,
		})),
	);

	return (
		<NodeStatusIndicator status={data.state} variant="border">
			<BaseNode className="w-80">
				<BaseNodeHeader>
					<MessageSquare className="h-4 w-4 text-neutral-500" />
					<BaseNodeHeaderTitle>{"Text generation"}</BaseNodeHeaderTitle>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size={"icon"} variant="ghost">
								<RefreshCcw />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel className="font-bold">
								Swap with
							</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => {
									replaceNode(id, "structured_output");
								}}
							>
								<MessageSquare className="mr-2 h-4 w-4 text-neutral-500" />
								Structured Output
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</BaseNodeHeader>
				<BaseNodeContent />
				<BaseNodeFooter className="w-full px-0">
					<div className="flex w-full flex-col items-start gap-2">
						{/** biome-ignore lint/correctness/useUniqueElementIds: id is used by react flow, not by react itself */}
						<LabeledHandle
							title="LLM"
							id="llm"
							type="target"
							position={Position.Left}
						/>
						{/** biome-ignore lint/correctness/useUniqueElementIds: id is used by react flow, not by react itself */}
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

export default memo(TextGenerationNode);
