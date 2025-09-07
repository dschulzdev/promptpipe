import { RedisModule } from "@liaoliaots/nestjs-redis";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard, AuthModule } from "@thallesp/nestjs-better-auth";
import { AiModule } from "./ai/ai.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { auth } from "./auth";
import { validateConfig } from "./configuration";
import { RunnerModule } from "./runner/runner.module";
import { WorkflowModule } from "./workflow/workflow.module";

@Module({
	imports: [
		AuthModule.forRoot(auth),
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
		AnalyticsModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule {}
