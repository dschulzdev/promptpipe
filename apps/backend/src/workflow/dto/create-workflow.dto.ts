import { ApiProperty } from "@nestjs/swagger";
import {
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";
import { PipelineConnectionDto } from "./pipeline-connection.dto";
import {
	PipelineNodeDto,
	PipelineNodeDtoDiscriminated,
} from "./pipeline-node.dto";

export class CreateWorkflowDto {
	@IsString()
	@IsNotEmpty()
	name: string;
	@ValidateNested({ each: true })
	@IsArray()
	@PipelineNodeDtoDiscriminated()
	@ApiProperty({
		oneOf: [
			{ $ref: "#/components/schemas/LlmNodeDto" },
			{ $ref: "#/components/schemas/TextInputNodeDto" },
			{ $ref: "#/components/schemas/TextOutputNodeDto" },
			{ $ref: "#/components/schemas/BasicStartNodeDto" },
			{ $ref: "#/components/schemas/TextGenerationNodeDto" },
			{ $ref: "#/components/schemas/StructuredOutputNodeDto" },
		],
	})
	@IsOptional()
	nodes?: Array<PipelineNodeDto>;
	@ValidateNested({ each: true })
	@IsOptional()
	connections?: Array<PipelineConnectionDto>;
}
