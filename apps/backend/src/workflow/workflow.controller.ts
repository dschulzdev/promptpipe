import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Sse,
} from "@nestjs/common";
import { Session, UserSession } from "@thallesp/nestjs-better-auth";
import { ProgressMessageWithTypeDto } from "../runner/dto/progress-message-with-type.dto";
import { CreateWorkflowDto } from "./dto/create-workflow.dto";
import { UpdateWorkflowDto } from "./dto/update-workflow.dto";
import { WorkflowDto } from "./dto/workflow.dto";
import { WorkflowHistoryDto } from "./dto/workflow-history.dto";
import { WorkflowService } from "./workflow.service";

@Controller("workflow")
export class WorkflowController {
	constructor(private readonly workflowService: WorkflowService) {}

	@Post("run/:workflowId")
	async run(
		@Param("workflowId") workflowId: string,
		@Session() session: UserSession,
	) {
		console.log("Running workflow with id:", workflowId);
		return await this.workflowService.runWorkflow(workflowId, session.user);
	}

	@Sse("stream/:runId")
	async streamUpdates(
		@Param("runId") runId: string,
		@Session() session: UserSession,
	) {
		return this.workflowService.getJobStream(runId, session.user);
	}

	@Get()
	async findAll(@Session() session: UserSession): Promise<WorkflowDto[]> {
		return await this.workflowService.findAll(session.user);
	}

	@Get(":id")
	async findOne(
		@Param("id") id: string,
		@Session() session: UserSession,
	): Promise<WorkflowDto> {
		const workflow = await this.workflowService.findOne(id, session.user);
		if (!workflow) {
			throw new NotFoundException(`Workflow with id ${id} not found`);
		}
		return workflow;
	}

	@Get(":id/history")
	async findHistory(
		@Param("id") id: string,
		@Session() session: UserSession,
	): Promise<WorkflowHistoryDto[]> {
		const history = await this.workflowService.findHistory(id, session.user);
		if (!history) {
			throw new NotFoundException(`Workflow with id ${id} not found`);
		}
		return history;
	}

	@Get(":id/history/:runId")
	async getLogForHistory(
		@Param("id") id: string,
		@Param("runId") runId: string,
		@Session() session: UserSession,
	): Promise<ProgressMessageWithTypeDto[]> {
		const entry = await this.workflowService.getLogForHistory(
			runId,
			session.user,
		);
		if (!entry) {
			throw new NotFoundException(`Workflow with id ${id} not found`);
		}
		return entry;
	}

	@Get(":runId/download")
	async downloadHistory(
		@Param("runId") runId: string,
		@Session() session: UserSession,
	): Promise<string> {
		return this.workflowService.downloadLogForSingleHistory(
			runId,
			session.user,
		);
	}

	@Delete(":id")
	async deleteOne(@Param("id") id: string, @Session() session: UserSession) {
		await this.workflowService.deleteOne(id, session.user);
	}

	@Post()
	async create(
		@Body() createWorkflowDto: CreateWorkflowDto,
		@Session() session: UserSession,
	): Promise<WorkflowDto> {
		return this.workflowService.create(createWorkflowDto, session.user);
	}

	@Patch(":id")
	async update(
		@Param("id") id: string,
		@Session() session: UserSession,
		@Body() updateWorkflowDto: UpdateWorkflowDto,
	): Promise<WorkflowDto> {
		return this.workflowService.update(id, updateWorkflowDto, session.user);
	}
}
