import { IsArray, IsInstance, ValidateNested } from "class-validator";
import { Pipeline } from "ioredis";
import { PipelineNodeDto } from "./pipeline-node.dto";

export class RunWorkloadDto {
	@ValidateNested({ each: true })
	@IsInstance(PipelineNodeDto, { each: true })
	nodes: PipelineNodeDto[];
}
