import {
	Body,
	Controller,
	Get,
	MessageEvent,
	NotFoundException,
	Param,
	Patch,
	Post,
	Sse,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { CreateWorkflowDto } from "./dto/create-workflow.dto";
import { UpdateWorkflowDto } from "./dto/update-workflow.dto";
import { WorkflowDto } from "./dto/workflow.dto";
import { WorkflowService } from "./workflow.service";

@Controller("workflow")
export class WorkflowController {
	constructor(private readonly workflowService: WorkflowService) {}

	@Post("run/:workflowId")
	async run(@Param("workflowId") workflowId: string) {
		console.log("Running workflow with id:", workflowId);
		return await this.workflowService.runWorkflow(workflowId);
	}

	@Sse("stream/:runId")
	streamUpdates(@Param("runId") runId: string): Observable<MessageEvent> {
		return this.workflowService.getJobStream(runId);
	}

	@Get()
	async findAll(): Promise<WorkflowDto[]> {
		return await this.workflowService.findAll();
	}

	@Get(":id")
	async findOne(@Param("id") id: string): Promise<WorkflowDto> {
		const workflow = await this.workflowService.findOne(id);
		if (!workflow) {
			throw new NotFoundException(`Workflow with id ${id} not found`);
		}
		return workflow;
	}

	@Post()
	async create(
		@Body() createWorkflowDto: CreateWorkflowDto,
	): Promise<WorkflowDto> {
		return this.workflowService.create(createWorkflowDto);
	}

	@Patch(":id")
	async update(
		@Param("id") id: string,
		@Body() updateWorkflowDto: UpdateWorkflowDto,
	): Promise<WorkflowDto> {
		return this.workflowService.update(id, updateWorkflowDto);
	}
}
