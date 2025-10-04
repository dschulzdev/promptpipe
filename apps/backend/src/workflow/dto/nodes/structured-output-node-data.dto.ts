import { IsJSON } from "class-validator";
import { NodeDataDto } from "../nodes.dto";

// biome-ignore lint/suspicious/noExplicitAny: needed
export interface StructuredOutputNodeData extends Record<string, any> {
	jsonSchema: string;
}

export class StructuredOutputNodeDataDto
	extends NodeDataDto
	implements StructuredOutputNodeData
{
	@IsJSON()
	jsonSchema: string;
}
