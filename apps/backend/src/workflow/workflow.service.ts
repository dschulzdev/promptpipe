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
import { PrismaService } from "../prisma/prisma.service";
import { RunnerService } from "../runner/runner.service";
import { getApplicationUser } from "../utils/get-application-user";
import { CreateWorkflowDto } from "./dto/create-workflow.dto";
import { UpdateWorkflowDto } from "./dto/update-workflow.dto";
import { WorkflowDto } from "./dto/workflow.dto";

@Injectable()
export class WorkflowService {
	constructor(
		private readonly runnerService: RunnerService,
		private readonly prismaService: PrismaService,
	) {}

	public async runWorkflow(
		workflowId: string,
		user: UserSession["user"],
	): Promise<string | undefined> {
		const workflowData = await this.prismaService.workflow.findUnique({
			where: { id: workflowId, ApplicationUser: { user: { id: user.id } } },
		});
		const applicationUser = await getApplicationUser(
			user.id,
			this.prismaService,
		);
		if (!applicationUser) {
			throw new UnauthorizedException(
				"You are not allowed to perform this action",
			);
		}
		if (!workflowData) {
			throw new NotFoundException(`Workflow with id ${workflowId} not found`);
		}
		// Implementation of the workflow execution logic
		return this.runnerService.runWorkflow({
			nodes: workflowData.nodes,
			connections: workflowData.connections,
			userId: applicationUser.id,
		});
	}
	public async getJobStream(
		jobId: string,
		user: UserSession["user"],
	): Promise<Observable<MessageEvent>> {
		// Implementation to get the job stream
		const applicationUser = await getApplicationUser(
			user.id,
			this.prismaService,
		);
		if (!applicationUser) {
			throw new UnauthorizedException(
				"You are not allowed to perform this action",
			);
		}
		const stream = this.runnerService.getJobStream(jobId, applicationUser.id);
		return stream;
	}

	public async findAll(user: UserSession["user"]) {
		return await this.prismaService.workflow.findMany({
			where: { ApplicationUser: { user: { id: user.id } } },
		});
	}

	public async findOne(id: string, user: UserSession["user"]) {
		return await this.prismaService.workflow.findUnique({
			where: { id, ApplicationUser: { user: { id: user.id } } },
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
