import { IsIn } from "class-validator";
import { ProgressType } from "../progress-message";
export class ProgressMessageWithTypeDto {
	@IsIn([
		"log",
		"progress_node",
		"success_node",
		"result_success",
		"result_fail",
		"fail_node",
	])
	type: ProgressType;
	payload: ProgressMessageDto;
}

export class ProgressMessageDto {
	payload?: {
		nodeId: string;
		data?: unknown;
	};
	log: string;
}
