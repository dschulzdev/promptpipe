import { instanceToInstance } from "class-transformer";
import { PipelineConnectionDto } from "src/workflow/dto/pipeline-connection.dto";
import { PipelineNodeDto } from "src/workflow/dto/pipeline-node.dto";
import { RunWorkloadDto } from "src/workflow/dto/run-workflow.dto";

/**
 * Checks if a graph, represented by a list of edges, contains a cycle.
 *
 * @param edges An array of edges that define the graph.
 * @returns `true` if a cycle is detected, otherwise `false`.
 */
export function hasCycle(edges: PipelineConnectionDto[]): boolean {
	// Step 1: Build the adjacency list and collect all unique nodes.
	// The adjacency list maps a node to its neighbors (nodes it points to).
	const adjList = new Map<string, string[]>();
	const allNodes = new Set<string>();

	for (const edge of edges) {
		allNodes.add(edge.sourceNodeId);
		allNodes.add(edge.targetNodeId);

		if (!adjList.has(edge.sourceNodeId)) {
			adjList.set(edge.sourceNodeId, []);
		}
		adjList.get(edge.sourceNodeId)?.push(edge.targetNodeId);
	}

	// Step 2: Initialize tracking sets for the DFS.
	// `visiting`: Nodes currently in the recursion stack for the current DFS path.
	// `visited`: Nodes that have been completely explored (all descendants visited).
	const visiting = new Set<string>();
	const visited = new Set<string>();

	/**
	 * Performs a Depth-First Search from a given node to detect a cycle.
	 * @param nodeId The ID of the node to start the search from.
	 * @returns `true` if a cycle is found, `false` otherwise.
	 */
	const dfs = (nodeId: string): boolean => {
		// Mark the current node as being visited in the current path.
		visiting.add(nodeId);

		const neighbors = adjList.get(nodeId) || [];

		for (const neighbor of neighbors) {
			// If the neighbor is in the current `visiting` set, we have found a cycle.
			if (visiting.has(neighbor)) {
				return true; // Cycle detected!
			}

			// If the neighbor has not been fully visited yet, recurse.
			if (!visited.has(neighbor)) {
				if (dfs(neighbor)) {
					return true; // Propagate the cycle detection result up.
				}
			}
		}

		// Backtrack: Remove the node from the `visiting` set as we leave its recursion path.
		visiting.delete(nodeId);
		// Mark the node as fully explored.
		visited.add(nodeId);

		return false;
	};

	// Step 3: Iterate through all nodes to handle disconnected graphs.
	// A graph can have multiple components, so we must try to start a DFS
	// from every node that hasn't been visited yet.
	for (const nodeId of allNodes) {
		if (!visited.has(nodeId)) {
			if (dfs(nodeId)) {
				console.log("nodeId", nodeId);
				return true; // A cycle was found in one of the components.
			}
		}
	}

	// If we've gone through all nodes and found no cycles, the graph is a DAG.
	return false;
}

export function deleteUnlinkedNodes(payload: RunWorkloadDto): RunWorkloadDto {
	const cleanedPayload = instanceToInstance(payload);
	const isNodeConnectedMap = new Map<string, boolean>();

	cleanedPayload.connections.forEach((connection) => {
		isNodeConnectedMap.set(connection.sourceNodeId, true);
		isNodeConnectedMap.set(connection.targetNodeId, true);
	});

	// Remove unlinked nodes
	cleanedPayload.nodes = cleanedPayload.nodes.filter((node) =>
		isNodeConnectedMap.has(node.id),
	);
	return cleanedPayload;
}

export function isNextNodeAvailable(
	payload: RunWorkloadDto,
	currentNode: PipelineNodeDto,
): boolean {
	const nextConnections = payload.connections.filter(
		(connection) =>
			connection.sourceNodeHandleId in
			currentNode.handles.map((handle) => handle.id),
	);
	return nextConnections.length > 0;
}
