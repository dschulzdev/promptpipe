import { Injectable, MessageEvent } from "@nestjs/common";
import { Observable } from "rxjs";
import { PrismaService } from "src/prisma/prisma.service";
import { RunnerService } from "src/runner/runner.service";
import { CreateWorkflowDto } from "./dto/create-workflow.dto";
import { RunWorkloadDto } from "./dto/run-workload.dto";

@Injectable()
export class WorkflowService {
	constructor(
		private readonly runnerService: RunnerService,
		private readonly prismaService: PrismaService,
	) {}

	public runWorkflow(
		workflowData: RunWorkloadDto,
	): Promise<string | undefined> {
		// Implementation of the workflow execution logic
		return this.runnerService.runWorkflow(workflowData);
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
		return await this.prismaService.workflow.findUnique({
			where: { id },
		});
	}

	public async create(createWorkflowDto: CreateWorkflowDto) {
		const workflow = await this.prismaService.workflow.create({
			data: createWorkflowDto,
		});
		return workflow;
	}
}
