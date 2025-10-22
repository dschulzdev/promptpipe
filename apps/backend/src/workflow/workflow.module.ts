import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { RunnerModule } from "../runner/runner.module";
import { StorageModule } from "../storage/storage.module";
import { WorkflowController } from "./workflow.controller";
import { WorkflowService } from "./workflow.service";

@Module({
	imports: [RunnerModule, PrismaModule, StorageModule],
	controllers: [WorkflowController],
	providers: [WorkflowService],
})
export class WorkflowModule {}
