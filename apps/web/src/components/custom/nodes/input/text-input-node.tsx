import { type Node, type NodeProps, Position } from "@xyflow/react";
import { MessageCircle, TextCursorInput } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
					<div className="flex flex-col gap-8">
						<div className="grid w-full max-w-sm items-center gap-1.5">
							<Label htmlFor="role">Role</Label>
							<Select
								value={data.role ?? "user"}
								onValueChange={(value) =>
									updateNode(id, {
										role: value,
									})
								}
							>
								<SelectTrigger>
									<div className="flex items-center gap-2">
										<MessageCircle className="h-4 w-4" />
										<SelectValue placeholder="Select a role" />
									</div>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="user">User</SelectItem>
									<SelectItem value="assistant">Assistant</SelectItem>
									<SelectItem value="system">System</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="grid w-full max-w-sm items-center gap-1.5">
							<Label htmlFor="prompt">Prompt</Label>
							<Input
								value={data.prompt}
								onChange={(e) =>
									updateNode(id, {
										prompt: e.target.value,
									})
								}
							/>
						</div>
					</div>
				</BaseNodeContent>
				<BaseNodeFooter className="w-full px-0">
					<div className="flex w-full flex-col items-start gap-2">
						<LabeledHandle
							title={"Start trigger"}
							type="target"
							position={Position.Left}
						/>
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

export default memo(TextInputNode);
