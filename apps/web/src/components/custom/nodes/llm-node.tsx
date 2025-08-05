import { type Node, type NodeProps, Position } from "@xyflow/react";
import { BotMessageSquare, RefreshCcw } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
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
import useNodeStore, { type LoadingStateMixin } from "@/stores/node-store";
import type { LLMNodeData } from "~/workflow/dto/nodes/llm-node-data.dto";
import {
	LLM_MODELS,
	type LLMProvider,
} from "../../../../../backend/src/ai/llm-providers";

export type LLMNodeProps = Node<LLMNodeData & LoadingStateMixin, "llm">;

function LLMNode({ id, data }: NodeProps<LLMNodeProps>) {
	const updateNode = useNodeStore((state) => state.updateNode);
	const models = LLM_MODELS[data.llmProvider];
	const renderData = LLMProviderRenderMap[data.llmProvider];
	const otherProviders = Object.entries(LLMProviderRenderMap).filter(
		([provider]) => provider !== data.llmProvider,
	);
	return (
		<NodeStatusIndicator status={data.state} variant="border">
			<BaseNode className="w-80">
				<BaseNodeHeader>
					<renderData.icon className="h-4 w-4 text-neutral-500" />
					<BaseNodeHeaderTitle>{renderData.title}</BaseNodeHeaderTitle>
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
							{otherProviders.map(([provider, render]) => (
								<DropdownMenuItem
									key={provider}
									onClick={() => {
										updateNode(id, {
											...data,
											llmProvider: provider,
											llmModel: LLM_MODELS[provider as LLMProvider][0],
										});
									}}
								>
									<render.icon className="mr-2 h-4 w-4 text-neutral-500" />
									{render.title}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</BaseNodeHeader>
				<BaseNodeContent>
					<div className="grid w-full max-w-sm items-center gap-1.5">
						<Label>Model</Label>
						<Select
							defaultValue={data.llmModel}
							value={data.llmModel}
							onValueChange={(value) => {
								updateNode(id, {
									...data,
									llmModel: value,
								});
							}}
						>
							<SelectTrigger className="w-full">
								<div className="flex items-center gap-2">
									<BotMessageSquare className="h-4 w-4" />
									<SelectValue placeholder="Select a model" />
								</div>
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
				</BaseNodeContent>
				<BaseNodeFooter className="w-full px-0">
					<div className="flex w-full flex-col items-end gap-2">
						<LabeledHandle
							title="LLM"
							type="source"
							position={Position.Right}
						/>
					</div>
				</BaseNodeFooter>
			</BaseNode>
		</NodeStatusIndicator>
	);
}

export default memo(LLMNode);
