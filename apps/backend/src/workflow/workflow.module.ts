import { Module } from "@nestjs/common";
import { RunnerModule } from "src/runner/runner.module";
import { WorkflowController } from "./workflow.controller";
import { WorkflowService } from "./workflow.service";

@Module({
	imports: [RunnerModule],
	controllers: [WorkflowController],
	providers: [WorkflowService],
})
export class WorkflowModule {}
