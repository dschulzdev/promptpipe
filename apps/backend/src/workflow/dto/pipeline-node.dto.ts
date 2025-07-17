import { Type, TypeHelpOptions } from "class-transformer";
import { IsEnum, IsString, IsUUID } from "class-validator";
import {
	BasicStartNodeDataDto,
	LLMNodeDataDto,
	NodeDataDto,
	NodeType,
	NodeTypes,
	TextGenerationNodeDataDto,
	TextInputNodeDataDto,
} from "./nodes.dto";

// Define the possible node types as a const for reusability

export class PipelineNodeDto {
	@IsString()
	@IsUUID()
	id: string;
	@IsEnum(NodeTypes)
	type: NodeType;
	@Type(
		({ object }: TypeHelpOptions) => {
			// `object` is the instance of PipelineNodeDto being transformed
			const type = (object as PipelineNodeDto).type;
			switch (type) {
				case "llm":
					return LLMNodeDataDto;
				case "basic_start":
					return BasicStartNodeDataDto;
				// For types with no specific data, we can return a generic or empty DTO
				case "text_input":
					return TextInputNodeDataDto;
				case "text_output":
					return TextInputNodeDataDto; // Assumes no data is needed
				case "text_generation":
					return TextGenerationNodeDataDto; // Assumes no data is needed
			}
		},
		{
			// This ensures the discriminator is available for the @Type function
			keepDiscriminatorProperty: true,
		},
	)
	data: NodeDataDto;
}
