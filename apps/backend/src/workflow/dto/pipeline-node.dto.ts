import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type, TypeHelpOptions } from "class-transformer";
import { IsEnum, IsString, ValidateNested } from "class-validator";
import { BasicStartNodeDataDto } from "./basic-start-node-data.dto";
import { LLMNodeDataDto } from "./llm-node-data.dto";
import { NodeDataDto, NodeTypes } from "./nodes.dto";
import { TextGenerationNodeDataDto } from "./text-generation-node-data.dto";
import { TextInputNodeDataDto } from "./text-input-node-data.dto";
import { TextOutputNodeDataDto } from "./text-output-node-data.dto";

// Define the possible node types as a const for reusability

export class PipelineNodeDto {
	@IsString()
	id: string;
	@IsEnum(NodeTypes)
	type: NodeTypes;
	@ValidateNested()
	@Type(
		({ object }: TypeHelpOptions) => {
			const type = (object as PipelineNodeDto).type;
			switch (type) {
				case NodeTypes.LLM:
					return LLMNodeDataDto;
				case NodeTypes.BASIC_START:
					return BasicStartNodeDataDto;
				// For types with no specific data, we can return a generic or empty DTO
				case NodeTypes.TEXT_INPUT:
					return TextInputNodeDataDto;
				case NodeTypes.TEXT_OUTPUT:
					return TextOutputNodeDataDto; // Assumes no data is needed
				case NodeTypes.TEXT_GENERATION:
					return TextGenerationNodeDataDto; // Assumes no data is needed
			}
		},
		{
			keepDiscriminatorProperty: true,
			discriminator: {
				property: "type",
				subTypes: [
					{ value: LLMNodeDataDto, name: NodeTypes.LLM },
					{ value: BasicStartNodeDataDto, name: NodeTypes.BASIC_START },
					{ value: TextInputNodeDataDto, name: NodeTypes.TEXT_INPUT },
					{ value: TextOutputNodeDataDto, name: NodeTypes.TEXT_OUTPUT },
					{ value: TextGenerationNodeDataDto, name: NodeTypes.TEXT_GENERATION },
				],
			},
		},
	)
	@ApiProperty({
		oneOf: [
			{ $ref: getSchemaPath(TextGenerationNodeDataDto) },
			{ $ref: getSchemaPath(TextInputNodeDataDto) },
			{ $ref: getSchemaPath(TextOutputNodeDataDto) },
			{ $ref: getSchemaPath(BasicStartNodeDataDto) },
			{ $ref: getSchemaPath(LLMNodeDataDto) },
		],
		discriminator: {
			propertyName: "type",
			mapping: {
				[NodeTypes.LLM]: getSchemaPath(LLMNodeDataDto),
				[NodeTypes.BASIC_START]: getSchemaPath(BasicStartNodeDataDto),
				[NodeTypes.TEXT_INPUT]: getSchemaPath(TextInputNodeDataDto),
				[NodeTypes.TEXT_OUTPUT]: getSchemaPath(TextOutputNodeDataDto),
				[NodeTypes.TEXT_GENERATION]: getSchemaPath(TextGenerationNodeDataDto),
			},
		},
	})
	data: NodeDataDto;
}
