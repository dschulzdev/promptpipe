import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { AiModule } from "src/ai/ai.module";
import { RunnerProcessor } from "./runner.processor";
import { RunnerService } from "./runner.service";

@Module({
	imports: [
		AiModule,
		BullModule.registerQueue({
			name: "workflow_runs",
		}),
	],
	controllers: [],
	providers: [RunnerService, RunnerProcessor],
	exports: [RunnerService],
})
export class RunnerModule {}
