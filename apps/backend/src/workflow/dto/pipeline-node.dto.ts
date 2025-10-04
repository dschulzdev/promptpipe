import { ApiProperty } from "@nestjs/swagger";
import { Type, TypeHelpOptions } from "class-transformer";
import { IsEnum, IsNumber, IsString, ValidateNested } from "class-validator";
import { BasicStartNodeDataDto } from "./nodes/basic-start-node-data.dto";
import { LLMNodeDataDto } from "./nodes/llm-node-data.dto";
import { MergeNodeDataDto } from "./nodes/merge-node-data.dto";
import { StructuredOutputNodeDataDto } from "./nodes/structured-output-node-data.dto";
import { TextGenerationNodeDataDto } from "./nodes/text-generation-node-data.dto";
import { TextInputNodeDataDto } from "./nodes/text-input-node-data.dto";
import { TextOutputNodeDataDto } from "./nodes/text-output-node-data.dto";
import { NodeTypes } from "./nodes.dto";

class Position {
	@IsNumber()
	x: number;

	@IsNumber()
	y: number;
}
export class BasePipelineNodeDto {
	@IsString()
	@ApiProperty()
	id!: string;

	@IsEnum(NodeTypes)
	@ApiProperty({ enum: NodeTypes })
	type!: NodeTypes;

	@ValidateNested()
	position: Position;
}

export class LlmNodeDto extends BasePipelineNodeDto {
	type: NodeTypes.LLM = NodeTypes.LLM;

	@ValidateNested()
	@Type(() => LLMNodeDataDto)
	@ApiProperty({ type: LLMNodeDataDto })
	data!: LLMNodeDataDto;
}

export class TextInputNodeDto extends BasePipelineNodeDto {
	type: NodeTypes.TEXT_INPUT = NodeTypes.TEXT_INPUT;

	@ValidateNested()
	@Type(() => TextInputNodeDataDto)
	@ApiProperty({ type: TextInputNodeDataDto })
	data!: TextInputNodeDataDto;
}

export class TextOutputNodeDto extends BasePipelineNodeDto {
	type: NodeTypes.TEXT_OUTPUT = NodeTypes.TEXT_OUTPUT;

	@ValidateNested()
	@Type(() => TextOutputNodeDataDto)
	@ApiProperty({ type: TextOutputNodeDataDto })
	data!: TextOutputNodeDataDto;
}

export class BasicStartNodeDto extends BasePipelineNodeDto {
	type: NodeTypes.BASIC_START = NodeTypes.BASIC_START;

	@ValidateNested()
	@Type(() => BasicStartNodeDataDto)
	@ApiProperty({ type: BasicStartNodeDataDto })
	data!: BasicStartNodeDataDto;
}

export class TextGenerationNodeDto extends BasePipelineNodeDto {
	type: NodeTypes.TEXT_GENERATION = NodeTypes.TEXT_GENERATION;

	@ValidateNested()
	@Type(() => TextGenerationNodeDataDto)
	@ApiProperty({ type: TextGenerationNodeDataDto })
	data!: TextGenerationNodeDataDto;
}

export class StructuredOutputNodeDto extends BasePipelineNodeDto {
	type: NodeTypes.STRUCTURED_OUTPUT = NodeTypes.STRUCTURED_OUTPUT;

	@ValidateNested()
	@Type(() => StructuredOutputNodeDataDto)
	@ApiProperty({ type: StructuredOutputNodeDataDto })
	data!: StructuredOutputNodeDataDto;
}

export class MergeNodeDto extends BasePipelineNodeDto {
	type: NodeTypes.MERGE = NodeTypes.MERGE;

	@ValidateNested()
	@Type(() => MergeNodeDataDto)
	@ApiProperty({ type: MergeNodeDataDto })
	data!: MergeNodeDataDto;
}

export type PipelineNodeDto =
	| LlmNodeDto
	| TextInputNodeDto
	| TextOutputNodeDto
	| BasicStartNodeDto
	| TextGenerationNodeDto
	| StructuredOutputNodeDto
	| MergeNodeDto;

export const PipelineNodeDtoDiscriminated = (
	options?: TypeHelpOptions,
): PropertyDecorator => {
	return Type(() => BasePipelineNodeDto, {
		discriminator: {
			property: "type",
			subTypes: [
				{ value: LlmNodeDto, name: NodeTypes.LLM },
				{ value: TextInputNodeDto, name: NodeTypes.TEXT_INPUT },
				{ value: TextOutputNodeDto, name: NodeTypes.TEXT_OUTPUT },
				{ value: BasicStartNodeDto, name: NodeTypes.BASIC_START },
				{
					value: TextGenerationNodeDto,
					name: NodeTypes.TEXT_GENERATION,
				},
				{ value: MergeNodeDto, name: NodeTypes.MERGE },
				{ value: StructuredOutputNodeDto, name: NodeTypes.STRUCTURED_OUTPUT },
			],
		},
		...options,
		keepDiscriminatorProperty: true,
	});
};
