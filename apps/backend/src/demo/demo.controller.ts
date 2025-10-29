import {
	Controller,
	Get,
	NotFoundException,
	Param,
	Post,
	Sse,
} from "@nestjs/common";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import { ProgressMessageWithTypeDto } from "../runner/dto/progress-message-with-type.dto";
import { WorkflowDto } from "../workflow/dto/workflow.dto";
import { WorkflowHistoryDto } from "../workflow/dto/workflow-history.dto";
import { DemoService } from "./demo.service";

@Controller("demo")
@AllowAnonymous()
export class DemoController {
	constructor(private readonly demoService: DemoService) {}

	@Get()
	async getDemo(): Promise<WorkflowDto> {
		return this.demoService.getDemo();
	}

	@Post("run")
	async runDemoWorkflow() {
		return this.demoService.runDemoWorkflow();
	}

	@Sse("stream/:runId")
	async streamDemoUpdates(@Param("runId") runId: string) {
		return this.demoService.getJobStream(runId);
	}

	@Get(":runId/download")
	async downloadLogForRun(@Param("runId") runId: string) {
		return this.demoService.downloadLogForRun(runId);
	}

	@Get("history")
	async findHistory(@Param("id") id: string): Promise<WorkflowHistoryDto[]> {
		const history = await this.demoService.findHistory();
		if (!history) {
			throw new NotFoundException(`Workflow with id ${id} not found`);
		}
		return history;
	}

	@Get("history/:runId")
	async getLogForHistory(
		@Param("id") _id: string,
		@Param("runId") runId: string,
	): Promise<ProgressMessageWithTypeDto[]> {
		const entry = await this.demoService.getLogForHistory(runId);
		if (!entry) {
			throw new NotFoundException(`Workflow with id ${runId} not found`);
		}
		return entry;
	}
}
