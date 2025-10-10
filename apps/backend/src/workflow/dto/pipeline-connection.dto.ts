import { IsOptional, IsString } from "class-validator";

export class PipelineConnectionDto {
	@IsString()
	id: string;
	@IsString()
	sourceNodeId: string;
	@IsString()
	targetNodeId: string;
	@IsString()
	sourceNodeHandleId: string;
	@IsString()
	@IsOptional()
	targetNodeHandleId?: string;
}
