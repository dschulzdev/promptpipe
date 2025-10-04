export enum NodeTypes {
	TEXT_INPUT = "text_input",
	TEXT_OUTPUT = "text_output",
	TEXT_GENERATION = "text_generation",
	BASIC_START = "basic_start",
	LLM = "llm",
	MERGE = "merge",
	STRUCTURED_OUTPUT = "structured_output",
}

export type NodeType = `${NodeTypes}`;

export class NodeDataDto {}

export type NodeActionDtos =
	| NodeTypes.TEXT_GENERATION
	| NodeTypes.STRUCTURED_OUTPUT;

export type NodeOutputDtos = NodeTypes.TEXT_OUTPUT;
