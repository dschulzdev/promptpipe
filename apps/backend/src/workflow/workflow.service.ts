import { Injectable, MessageEvent } from "@nestjs/common";
import { Observable } from "rxjs";
import { RunnerService } from "src/runner/runner.service";

@Injectable()
export class WorkflowService {
	constructor(private readonly runnerService: RunnerService) {}

	public runWorkflow(workflowData: string): Promise<string | undefined> {
		// Implementation of the workflow execution logic
		return this.runnerService.runWorkflow(workflowData);
	}
	public getJobStream(jobId: string): Observable<MessageEvent> {
		// Implementation to get the job stream
		return this.runnerService.getJobStream(jobId);
	}
}
