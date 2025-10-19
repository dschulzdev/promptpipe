import { IsDate, IsOptional, IsString } from "class-validator";

export class WorkflowHistoryDto {
	@IsString()
	id: string;
	@IsDate()
	createdAt: Date;
	@IsDate()
	updatedAt: Date;
	@IsString()
	status: string;
	@IsString()
	@IsOptional()
	errorMessage: string | null;
	@IsDate()
	startedAt: Date;
	@IsDate()
	@IsOptional()
	completedAt: Date | null;
	@IsString()
	workflowId: string;
}
