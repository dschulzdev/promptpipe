import { type Node, type NodeProps, Position } from "@xyflow/react";
import { MessageSquare } from "lucide-react";
import { memo, useState } from "react";
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
import { isValidJsonSchema } from "@/lib/nodes/json-utils";
import useNodeStore, { type LoadingStateMixin } from "@/stores/node-store";
import type { StructuredOutputNodeData } from "~/workflow/dto/nodes/structured-output-node-data.dto";

export type StructuredOutputNodeProps = Node<
	StructuredOutputNodeData & LoadingStateMixin,
	"structured_output"
>;

function StructuredOutputNode({
	id,
	data,
}: NodeProps<StructuredOutputNodeProps>) {
	const updateNode = useNodeStore((state) => state.updateNode);
	const [validSchema, setValidSchema] = useState(true);
	return (
		<NodeStatusIndicator status={data.state} variant="border">
			<BaseNode className="w-80">
				<BaseNodeHeader>
					<MessageSquare className="h-4 w-4 text-neutral-500" />
					<BaseNodeHeaderTitle>{"Structured Output"}</BaseNodeHeaderTitle>
				</BaseNodeHeader>
				<BaseNodeContent>
					<div className="flex flex-col gap-2">
						<Label htmlFor="prompt">JSON Schema</Label>
						<Input
							value={data.jsonSchema}
							onChange={(e) =>
								updateNode(id, {
									jsonSchema: e.target.value,
								})
							}
							onBlur={() => {
								const validSchema = isValidJsonSchema(data.prompt);
								setValidSchema(validSchema);
							}}
						/>
						{!validSchema && (
							<p className="text-red-500 text-xs">Invalid JSON Schema</p>
						)}
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
