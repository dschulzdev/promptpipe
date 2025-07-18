import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { PipelineConnectionDto } from "./pipeline-connection.dto";
import { PipelineNodeDto } from "./pipeline-node.dto";

export class RunWorkloadDto {
	@ValidateNested({ each: true })
	@IsArray()
	@Type(() => PipelineNodeDto)
	nodes: PipelineNodeDto[];

	@ValidateNested()
	@IsArray()
	@Type(() => PipelineConnectionDto)
	connections: PipelineConnectionDto[];
}
