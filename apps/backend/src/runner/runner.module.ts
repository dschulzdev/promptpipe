import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { AiModule } from "src/ai/ai.module";
import { RunnerController } from "./runner.controller";
import { RunnerService } from "./runner.service";

@Module({
	imports: [
		AiModule,
		BullModule.registerQueue({
			name: "workflow_runs",
		}),
	],
	controllers: [RunnerController],
	providers: [RunnerService],
})
export class RunnerModule {}
