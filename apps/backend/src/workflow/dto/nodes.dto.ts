import { BasicStartNodeDataDto } from "./basic-start-node-data.dto";
import { LLMNodeDataDto } from "./llm-node-data.dto";
import { TextGenerationNodeDataDto } from "./text-generation-node-data.dto";
import { TextInputNodeDataDto } from "./text-input-node-data.dto";
import { TextOutputNodeDataDto } from "./text-output-node-data.dto";

export enum NodeTypes {
	TEXT_INPUT = "text_input",
	TEXT_OUTPUT = "text_output",
	TEXT_GENERATION = "text_generation",
	BASIC_START = "basic_start",
	LLM = "llm",
}

export type NodeType = `${NodeTypes}`;

export type NodeDataDto =
	| TextGenerationNodeDataDto
	| TextInputNodeDataDto
	| TextOutputNodeDataDto
	| BasicStartNodeDataDto
	| LLMNodeDataDto;
