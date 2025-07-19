import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { PipelineConnectionDto } from "./pipeline-connection.dto";
import {
	PipelineNodeDto,
	PipelineNodeDtoDiscriminated,
} from "./pipeline-node.dto";

export class RunWorkloadDto {
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
		],
	})
	nodes: PipelineNodeDto[];

	@ValidateNested()
	@IsArray()
	@Type(() => PipelineConnectionDto)
	@ApiProperty({ type: [PipelineConnectionDto] })
	connections: PipelineConnectionDto[];
}
