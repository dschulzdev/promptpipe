import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { PipelineConnectionDto } from "./pipeline-connection.dto";
import {
	PipelineNodeDto,
	PipelineNodeDtoDiscriminated,
} from "./pipeline-node.dto";

export class WorkflowDto {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
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
			{ $ref: "#/components/schemas/MergeNodeDto" },
			{ $ref: "#/components/schemas/StructuredOutputNodeDto" },
		],
	})
	nodes: Array<PipelineNodeDto>;
	@ValidateNested({ each: true })
	@IsArray()
	@Type(() => PipelineConnectionDto)
	@ApiProperty({ type: [PipelineConnectionDto] })
	connections: PipelineConnectionDto[];
}
