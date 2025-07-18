import { IsBoolean } from "class-validator";

export interface TextGenerationNodeData extends Record<string, any> {
	json_mode: boolean;
}

export class TextGenerationNodeDataDto implements TextGenerationNodeData {
	@IsBoolean()
	json_mode: boolean;
}
