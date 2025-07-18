import {
	Body,
	Controller,
	MessageEvent,
	Param,
	Post,
	Sse,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { RunWorkloadDto } from "./dto/run-workload.dto";
import { WorkflowService } from "./workflow.service";

@Controller("workflow")
export class WorkflowController {
	constructor(private readonly workflowService: WorkflowService) {}

	@Post("run")
	async run(@Body() runWorkloadDto: RunWorkloadDto) {
		console.log("Running workflow with data:", runWorkloadDto);
		return await this.workflowService.runWorkflow(runWorkloadDto);
	}

	@Sse("stream/:runId")
	streamUpdates(@Param("runId") runId: string): Observable<MessageEvent> {
		return this.workflowService.getJobStream(runId);
	}
}
