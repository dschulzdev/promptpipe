import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { AiModule } from "src/ai/ai.module";
import { AnalyticsModule } from "src/analytics/analytics.module";
import { RunnerProcessor } from "./runner.processor";
import { RunnerService } from "./runner.service";

@Module({
	imports: [
		AiModule,
		BullModule.registerQueue({
			name: "workflow_runs",
		}),
		AnalyticsModule,
	],
	controllers: [],
	providers: [RunnerService, RunnerProcessor],
	exports: [RunnerService],
})
export class RunnerModule {}
