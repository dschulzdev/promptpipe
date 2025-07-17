import { type Node, type NodeProps, Position } from "@xyflow/react";
import { memo } from "react";
import {
	BaseNode,
	BaseNodeContent,
	BaseNodeFooter,
	BaseNodeHeader,
	BaseNodeHeaderTitle,
} from "@/components/base-node";
import { LabeledHandle } from "@/components/labeled-handle";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { LLMProviderRenderMap } from "@/constants/llm-providers";
import type { LLMNodeData } from "~/workflow/dto/nodes.dto";
import { LLM_MODELS } from "../../../../../backend/src/ai/llm-providers";

export type LLMNodeProps = Node<LLMNodeData, "llm">;

function LLMNode({ data }: NodeProps<LLMNodeProps>) {
	const models = LLM_MODELS[data.llmProvider];
	const renderData = LLMProviderRenderMap[data.llmProvider];
	return (
		<BaseNode className="w-80">
			<BaseNodeHeader>
				<renderData.icon className="h-4 w-4 text-neutral-500" />
				<BaseNodeHeaderTitle>{renderData.title}</BaseNodeHeaderTitle>
			</BaseNodeHeader>
			<BaseNodeContent>
				<Select defaultValue={models[0]}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select a model" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Models</SelectLabel>
							{models.map((model) => (
								<SelectItem key={model} value={model}>
									{model}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</BaseNodeContent>
			<BaseNodeFooter className="w-full px-0">
				<div className="flex w-full flex-col items-end gap-2">
					<LabeledHandle title="LLM" type="target" position={Position.Right} />
				</div>
			</BaseNodeFooter>
		</BaseNode>
	);
}

export default memo(LLMNode);
