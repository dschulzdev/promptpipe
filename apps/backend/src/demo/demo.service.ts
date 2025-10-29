import { Injectable, MessageEvent } from "@nestjs/common";
import { Observable } from "rxjs";
import { PrismaService } from "../prisma/prisma.service";
import { RunnerService } from "../runner/runner.service";
import { StorageService } from "../storage/storage.service";
import { WorkflowDto } from "../workflow/dto/workflow.dto";
import { demoWorkflow } from "./demo-data";

@Injectable()
export class DemoService {
	async getDemo(): Promise<WorkflowDto> {
		const demo = await this.prismaService.workflow.findFirst({
			where: { id: "demo" },
		});
		if (!demo) {
			throw new Error("Demo workflow not found");
		}
		return demo;
	}
	constructor(
		private readonly runnerService: RunnerService,
		private readonly storageService: StorageService,
		private readonly prismaService: PrismaService,
	) {}

	async getLogForHistory(runId: string) {
		return this.storageService.getLogById({
			id: runId,
			userId: "demo",
		});
	}
	async findHistory() {
		const historyEntries = await this.prismaService.workflow.findUnique({
			where: { id: "demo" },
			select: {
				WorkflowRun: {
					orderBy: { createdAt: "desc" },
				},
			},
		});
		return historyEntries?.WorkflowRun;
	}

	public async getJobStream(jobId: string): Promise<Observable<MessageEvent>> {
		return this.runnerService.getJobStream(jobId, "demo");
	}

	public async runDemoWorkflow(): Promise<string | undefined> {
		return this.runnerService.runWorkflow({
			nodes: demoWorkflow.nodes,
			connections: demoWorkflow.connections,
			workflowId: "demo",
			userId: "demo",
		});
	}

	public async downloadLogForRun(runId: string): Promise<string | undefined> {
		return this.storageService.getSignedLogUrl({
			id: runId,
			userId: "demo",
		});
	}
}
