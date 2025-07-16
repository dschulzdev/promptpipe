import { Controller, MessageEvent, Param, Post, Sse } from "@nestjs/common";
import { Observable } from "rxjs";
import { WorkflowService } from "./workflow.service";

@Controller("workflow")
export class WorkflowController {
	constructor(private readonly workflowService: WorkflowService) {}

	@Post("run")
	async run() {
		return await this.workflowService.runWorkflow("example-workflow-data");
	}

	@Sse("stream/:runId")
	streamUpdates(@Param("runId") runId: string): Observable<MessageEvent> {
		return this.workflowService.getJobStream(runId);
	}
}
