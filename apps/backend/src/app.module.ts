import { RedisModule } from "@liaoliaots/nestjs-redis";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AiModule } from "./ai/ai.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { validateConfig } from "./configuration";
import { RunnerModule } from "./runner/runner.module";
import { WorkflowModule } from "./workflow/workflow.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [validateConfig],
			envFilePath: ".env",
		}),
		BullModule.forRoot({
			connection: {
				host: "localhost",
				port: 6379,
			},
		}),
		RedisModule.forRoot({
			config: [
				{
					host: "localhost",
					port: 6379,
				},
				{
					namespace: "runner-subscriber",
					host: "localhost",
					port: 6379,
				},
			],
		}),
		RunnerModule,
		AiModule,
		WorkflowModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
