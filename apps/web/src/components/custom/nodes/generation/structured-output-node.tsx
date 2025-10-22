import { type Node, type NodeProps, Position } from "@xyflow/react";
import { MessageSquare, Pencil, RefreshCcw } from "lucide-react";
import { memo, useState } from "react";
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
import type { StructuredOutputNodeData } from "~/workflow/dto/nodes/structured-output-node-data.dto";
import JsonSchemaBuilderDialog from "../../json-schema-builder-dialog";

export type StructuredOutputNodeProps = Node<
	StructuredOutputNodeData & LoadingStateMixin,
	"structured_output"
>;

function StructuredOutputNode({
	id,
	data,
}: NodeProps<StructuredOutputNodeProps>) {
	const { updateNode, replaceNode } = useNodeStore(
		useShallow((state) => ({
			updateNode: state.updateNode,
			replaceNode: state.replaceNode,
		})),
	);
	const [validSchema, setValidSchema] = useState(true);
	const [isBuilderOpen, setIsBuilderOpen] = useState(false);

	return (
		<NodeStatusIndicator status={data.state} variant="border">
			<BaseNode className="w-80">
				<BaseNodeHeader>
					<MessageSquare className="h-4 w-4 text-neutral-500" />
					<BaseNodeHeaderTitle>{"Structured Output"}</BaseNodeHeaderTitle>
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
									replaceNode(id, "text_generation");
								}}
							>
								<MessageSquare className="mr-2 h-4 w-4 text-neutral-500" />
								Text Generation
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</BaseNodeHeader>
				<BaseNodeContent>
					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between">
							<Button
								variant="outline"
								className="w-full"
								size="sm"
								onClick={() => setIsBuilderOpen(true)}
							>
								<Pencil className="mr-2 h-4 w-4" />
								Edit Schema
							</Button>
						</div>
						{!validSchema && (
							<p className="text-red-500 text-xs">Invalid JSON Schema</p>
						)}
					</div>
				</BaseNodeContent>
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
			<JsonSchemaBuilderDialog
				open={isBuilderOpen}
				onOpenChange={setIsBuilderOpen}
				onSave={(schema) => {
					updateNode(id, { jsonSchema: JSON.stringify(schema, null, 2) });
				}}
				onError={(b) => setValidSchema(!b)}
				initialSchema={data.jsonSchema}
			/>
		</NodeStatusIndicator>
	);
}

export default memo(StructuredOutputNode);
