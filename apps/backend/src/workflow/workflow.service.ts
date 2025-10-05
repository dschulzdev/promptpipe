import {
	Injectable,
	MessageEvent,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { UserSession } from "@thallesp/nestjs-better-auth";
import { instanceToPlain } from "class-transformer";
import { ResultAsync } from "neverthrow";
import { Observable } from "rxjs";
import { PrismaService } from "src/prisma/prisma.service";
import { RunnerService } from "src/runner/runner.service";
import { getApplicationUser } from "src/utils/get-application-user";
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
			nodes: workflowData.nodes,
			connections: workflowData.connections,
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

	async deleteOne(id: string, user: UserSession["user"]) {
		const applicationUser =
			await this.checkApplicationUserAndAccessControl(user);
		await ResultAsync.fromPromise(
			this.prismaService.workflow.delete({
				where: { id, applicationUserId: applicationUser.id },
			}),
			() => new NotFoundException(`Workflow with id ${id} not found`),
		);
	}

	public async create(
		createWorkflowDto: CreateWorkflowDto,
		user: UserSession["user"],
	) {
		const applicationUser =
			await this.checkApplicationUserAndAccessControl(user);
		const workflow = await this.prismaService.workflow.create({
			data: {
				name: createWorkflowDto.name,
				applicationUserId: applicationUser.id,
				nodes: instanceToPlain(createWorkflowDto.nodes ?? []),
				connections: instanceToPlain(createWorkflowDto.connections ?? []),
			},
		});
		return workflow;
	}

	public async update(
		id: string,
		updateWorkflowDto: UpdateWorkflowDto,
		user: UserSession["user"],
	): Promise<WorkflowDto> {
		const applicationUser =
			await this.checkApplicationUserAndAccessControl(user);
		const workflowToUpdate = await this.prismaService.workflow.findFirst({
			where: { id, applicationUserId: applicationUser.id },
		});
		if (!workflowToUpdate) {
			throw new NotFoundException(`Workflow with id ${id} not found`);
		}
		if (workflowToUpdate.applicationUserId !== applicationUser.id) {
			throw new UnauthorizedException(
				"You are not allowed to update this workflow",
			);
		}

		const workflow = await this.prismaService.workflow.update({
			where: { id },
			data: updateWorkflowDto,
		});
		return workflow;
	}

	private async checkApplicationUserAndAccessControl(
		user: UserSession["user"],
	) {
		const applicationUser = await getApplicationUser(
			user.id,
			this.prismaService,
		);
		if (!applicationUser) {
			throw new UnauthorizedException(
				"Application user not found for the authenticated user",
			);
		}
		return applicationUser;
	}
}
