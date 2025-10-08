import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { RunnerModule } from "../runner/runner.module";
import { WorkflowController } from "./workflow.controller";
import { WorkflowService } from "./workflow.service";

@Module({
	imports: [RunnerModule, PrismaModule],
	controllers: [WorkflowController],
	providers: [WorkflowService],
})
export class WorkflowModule {}
