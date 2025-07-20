import { OmitType, PartialType } from "@nestjs/swagger";
import { WorkflowDto } from "./workflow.dto";

export class UpdateWorkflowDto extends PartialType(
	OmitType(WorkflowDto, ["id", "createdAt", "updatedAt"] as const),
) {}
