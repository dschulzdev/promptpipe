import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { AiModule } from "../ai/ai.module";
import { AnalyticsModule } from "../analytics/analytics.module";
import { PrismaModule } from "../prisma/prisma.module";
import { RunnerProcessor } from "./runner.processor";
import { RunnerService } from "./runner.service";

@Module({
	imports: [
		AiModule,
		BullModule.registerQueue({
			name: "workflow_runs",
		}),
		AnalyticsModule,
		PrismaModule,
	],
	controllers: [],
	providers: [RunnerService, RunnerProcessor],
	exports: [RunnerService],
})
export class RunnerModule {}
