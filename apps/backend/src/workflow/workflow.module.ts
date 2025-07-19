import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { RunnerModule } from "src/runner/runner.module";
import { WorkflowController } from "./workflow.controller";
import { WorkflowService } from "./workflow.service";

@Module({
	imports: [RunnerModule, PrismaModule],
	controllers: [WorkflowController],
	providers: [WorkflowService],
})
export class WorkflowModule {}
