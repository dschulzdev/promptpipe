import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import { memo } from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	LLM_MODELS,
	type LLMProvider,
	LLMProviderRenderMap,
} from "@/constants/llm-providers";

export type LLMNodeProps = Node<
	{
		llmProvider: LLMProvider;
	},
	"llm"
>;

function LLMNode({ data }: NodeProps<LLMNodeProps>) {
	const models = LLM_MODELS[data.llmProvider];
	const renderData = LLMProviderRenderMap[data.llmProvider];
	return (
		<div className="flex w-48 flex-col rounded-md border border-neutral-300 bg-white shadow-md">
			<div className="flex items-center gap-2 border-neutral-300 border-b p-2">
				<renderData.icon className="h-4 w-4 text-neutral-500" />
				<p className="font-medium text-neutral-500 text-sm">
					{renderData.title}
				</p>
			</div>
			<div className="p-2">
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
			</div>
			<Handle type="source" position={Position.Left} />
			<Handle type="target" position={Position.Right} />
		</div>
	);
}

export default memo(LLMNode);
