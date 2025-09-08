import {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	type Edge,
	type Node,
	type OnConnect,
	type OnEdgesChange,
	type OnNodesChange,
} from "@xyflow/react";
import { create } from "zustand";
import type { PipelineConnectionDto } from "@/api-client";
import type { BasicStartNodeProps } from "@/components/custom/nodes/basic/start-node";
import type { StructuredOutputNodeProps } from "@/components/custom/nodes/generation/structured-output-node";
import type { TextGenerationNodeProps } from "@/components/custom/nodes/generation/text-generation-node";
import type { TextInputNodeProps } from "@/components/custom/nodes/input/text-input-node";
import type { LLMNodeProps } from "@/components/custom/nodes/llm-node";
import type { TextOutputNodeProps } from "@/components/custom/nodes/output/text-output-node";
import type { MergeNodeProps } from "@/components/custom/nodes/processing/merge-node";
import type { NodeInputData } from "@/constants/node_types";
import {
	LLM_MODELS,
	type LLMProvider,
} from "../../../backend/src/ai/llm-providers";
import type { PipelineNodeDto } from "../../../backend/src/workflow/dto/pipeline-node.dto";

export type AppNode = Node<NodeInputData>;

export type NodeState = {
	nodes: AppNode[];
	edges: Edge[];
};

export type LoadingStateMixin = {
	state: "initial" | "loading" | "success" | "error";
};

export type NodeActions = {
	initData: (
		nodes: PipelineNodeDto[],
		connections: PipelineConnectionDto[],
	) => void;
	onNodesChange: OnNodesChange<AppNode>;
	onEdgesChange: OnEdgesChange;
	onConnect: OnConnect;
	addLLMNode: (provider: LLMProvider) => void;
	addTextInputNode: () => void;
	addBasicStartNode: () => void;
	addTextGenerationNode: () => void;
	addStructuredOutputNode: () => void;
	addTextOutputNode: () => void;
	addMergeNode: () => void;
	updateNode: (id: string, data: NodeInputData) => void;
	setNodes: (nodes: AppNode[]) => void;
	setEdges: (edges: Edge[]) => void;
};

const initialNodes: AppNode[] = [];
const initialEdges: Edge[] = [];

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useNodeStore = create<NodeState & NodeActions>((set, get) => ({
	nodes: initialNodes,
	edges: initialEdges,
	initData: (nodes, connections) => {
		const transformedNodes: AppNode[] = nodes.map((node) => ({
			id: node.id,
			type: node.type,
			data: {
				...node.data,
				state: "initial",
			},
			position: node.position,
		}));
		const transformedConnections: Edge[] = connections.map((connection) => ({
			id: connection.id,
			source: connection.sourceNodeId,
			target: connection.targetNodeId,
			sourceHandle: connection.sourceNodeHandleId,
			targetHandle: connection.targetNodeHandleId,
		}));
		set({
			nodes: transformedNodes,
			edges: transformedConnections,
		});
	},
	onNodesChange: (changes) => {
		set({
			nodes: applyNodeChanges(changes, get().nodes),
		});
	},
	onEdgesChange: (changes) => {
		set({
			edges: applyEdgeChanges(changes, get().edges),
		});
	},
	onConnect: (connection) => {
		set({
			edges: addEdge(connection, get().edges),
		});
	},
	updateNode: (id: string, data: NodeInputData) => {
		set({
			nodes: get().nodes.map((node) => {
				if (node.id === id) {
					return {
						...node,
						data: {
							...node.data,
							...data,
						},
					};
				}
				return node;
			}),
		});
	},
	addTextInputNode: () => {
		const newNode: TextInputNodeProps = {
			id: crypto.randomUUID(),
			type: "text_input",
			data: {
				role: "user",
				state: "initial",
				prompt: "Why is the banana yellow?",
			},
			position: generateRandomStartPosition(),
		};
		set({
			nodes: [...get().nodes, newNode],
		});
	},
	addBasicStartNode: () => {
		const newNode: BasicStartNodeProps = {
			id: crypto.randomUUID(),
			type: "basic_start",
			data: {
				state: "initial",
			},
			position: generateRandomStartPosition(),
		};
		set({
			nodes: [...get().nodes, newNode],
		});
	},
	addTextOutputNode: () => {
		const newNode: TextOutputNodeProps = {
			id: crypto.randomUUID(),
			type: "text_output",
			data: {
				state: "initial",
				response: [],
			},
			position: generateRandomStartPosition(),
		};
		set({
			nodes: [...get().nodes, newNode],
		});
	},
	addTextGenerationNode: () => {
		const newNode: TextGenerationNodeProps = {
			id: crypto.randomUUID(),
			type: "text_generation",
			data: {
				state: "initial",
				json_mode: false,
			},
			position: generateRandomStartPosition(),
		};
		set({
			nodes: [...get().nodes, newNode],
		});
	},
	addStructuredOutputNode: () => {
		const newNode: StructuredOutputNodeProps = {
			id: crypto.randomUUID(),
			type: "structured_output",
			data: {
				state: "initial",
				json_mode: false,
			},
			position: generateRandomStartPosition(),
		};
		set({
			nodes: [...get().nodes, newNode],
		});
	},
	addLLMNode: (provider) => {
		const newNode: LLMNodeProps = {
			id: crypto.randomUUID(),
			type: "llm",
			data: {
				state: "initial",
				llmProvider: provider,
				llmModel: LLM_MODELS[provider][0], // Default to the first model for the provider],
			},
			position: generateRandomStartPosition(),
		};
		set({
			nodes: [...get().nodes, newNode],
		});
	},
	addMergeNode: () => {
		const newNode: MergeNodeProps = {
			id: crypto.randomUUID(),
			type: "merge",
			data: {
				state: "initial",
				inputs: [],
			},
			position: generateRandomStartPosition(),
		};
		set({
			nodes: [...get().nodes, newNode],
		});
	},
	setNodes: (nodes) => {
		set({ nodes });
	},
	setEdges: (edges) => {
		set({ edges });
	},
}));

export default useNodeStore;

function generateRandomStartPosition() {
	return {
		x: Math.round(Math.random() * 100),
		y: Math.round(Math.random() * 100),
	};
}
