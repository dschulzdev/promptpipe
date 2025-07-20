import { ApiProperty } from "@nestjs/swagger";
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
	nodes: Array<PipelineNodeDto>;
	connections: PipelineConnectionDto[];
}
