import { ApiProperty } from "@nestjs/swagger";
import { Type, TypeHelpOptions } from "class-transformer";
import { IsEnum, IsString, ValidateNested } from "class-validator";
import { BasicStartNodeDataDto } from "./basic-start-node-data.dto";
import { LLMNodeDataDto } from "./llm-node-data.dto";
import { NodeHandleDto } from "./node-handle.dto";
import { NodeTypes } from "./nodes.dto";
import { TextGenerationNodeDataDto } from "./text-generation-node-data.dto";
import { TextInputNodeDataDto } from "./text-input-node-data.dto";
import { TextOutputNodeDataDto } from "./text-output-node-data.dto";

class BasePipelineNodeDto {
	@IsString()
	@ApiProperty()
	id!: string;

	@IsEnum(NodeTypes)
	@ApiProperty({ enum: NodeTypes })
	type!: NodeTypes;

	@ValidateNested({ each: true })
	handles: NodeHandleDto[];
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

export type PipelineNodeDto =
	| LlmNodeDto
	| TextInputNodeDto
	| TextOutputNodeDto
	| BasicStartNodeDto
	| TextGenerationNodeDto;

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
				{ value: TextGenerationNodeDto, name: NodeTypes.TEXT_GENERATION },
			],
		},
		...options,
		keepDiscriminatorProperty: true,
	});
};
