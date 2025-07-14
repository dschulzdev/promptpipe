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
import type { LLMNodeProps } from "@/components/custom/nodes/llm-node";
import type { LLMProvider } from "@/constants/llm-providers";

export type AppNode = Node;

export type AppState = {
	nodes: AppNode[];
	edges: Edge[];
	onNodesChange: OnNodesChange<AppNode>;
	onEdgesChange: OnEdgesChange;
	onConnect: OnConnect;
	addLLMNode: (provider: LLMProvider) => void;
	setNodes: (nodes: AppNode[]) => void;
	setEdges: (edges: Edge[]) => void;
};

const initialNodes: AppNode[] = [];
const initialEdges: Edge[] = [];

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useNodeStore = create<AppState>((set, get) => ({
	nodes: initialNodes,
	edges: initialEdges,
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
	addLLMNode: (provider) => {
		const x = Math.round(Math.random() * 100);
		const y = Math.round(Math.random() * 100);
		const newNode: LLMNodeProps = {
			id: crypto.randomUUID(),
			type: "llm",
			data: {
				llmProvider: provider,
			},
			position: { x: x, y: y },
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
