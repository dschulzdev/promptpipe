import { Injectable, MessageEvent, NotFoundException } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { Observable } from "rxjs";
import { PrismaService } from "src/prisma/prisma.service";
import { RunnerService } from "src/runner/runner.service";
import { CreateWorkflowDto } from "./dto/create-workflow.dto";
import { UpdateWorkflowDto } from "./dto/update-workflow.dto";
import { WorkflowDto } from "./dto/workflow.dto";

@Injectable()
export class WorkflowService {
	constructor(
		private readonly runnerService: RunnerService,
		private readonly prismaService: PrismaService,
	) {}

	public async runWorkflow(workflowId: string): Promise<string | undefined> {
		const workflowData = await this.prismaService.workflow.findUnique({
			where: { id: workflowId },
		});
		if (!workflowData) {
			throw new NotFoundException(`Workflow with id ${workflowId} not found`);
		}
		// Implementation of the workflow execution logic
		return this.runnerService.runWorkflow({
			nodes: instanceToPlain(workflowData.nodes),
			connections: instanceToPlain(workflowData.connections),
		});
	}
	public getJobStream(jobId: string): Observable<MessageEvent> {
		// Implementation to get the job stream
		const stream = this.runnerService.getJobStream(jobId);
		return stream;
	}

	public async findAll() {
		return await this.prismaService.workflow.findMany();
	}
	public async findOne(id: string) {
		//await new Promise((resolve) => setTimeout(resolve, 10000)); // Simulate delay
		return await this.prismaService.workflow.findUnique({
			where: { id },
		});
	}

	public async create(createWorkflowDto: CreateWorkflowDto) {
		const workflow = await this.prismaService.workflow.create({
			data: {
				name: createWorkflowDto.name,
				nodes: instanceToPlain(createWorkflowDto.nodes ?? []),
				connections: instanceToPlain(createWorkflowDto.connections ?? []),
			},
		});
		return workflow;
	}

	public async update(
		id: string,
		updateWorkflowDto: UpdateWorkflowDto,
	): Promise<WorkflowDto> {
		const workflow = await this.prismaService.workflow.update({
			where: { id },
			data: updateWorkflowDto,
		});
		return workflow;
	}
}
