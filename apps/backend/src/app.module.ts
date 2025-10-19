import { RedisModule } from "@liaoliaots/nestjs-redis";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard, AuthModule } from "@thallesp/nestjs-better-auth";
import { AiModule } from "./ai/ai.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { AppController } from "./app.controller";
import { auth } from "./auth";
import { validateConfig } from "./configuration";
import { PrismaModule } from "./prisma/prisma.module";
import { PrismaService } from "./prisma/prisma.service";
import { RunnerModule } from "./runner/runner.module";
import { StorageModule } from "./storage/storage.module";
import { StorageService } from "./storage/storage.service";
import { WorkflowModule } from "./workflow/workflow.module";

@Module({
	imports: [
		PrismaModule,
		AuthModule.forRootAsync({
			imports: [PrismaModule],
			useFactory: (prisma: PrismaService) => {
				return {
					auth: auth(prisma),
					disableTrustedOriginsCors: false, // Enable CORS handling by Better Auth
				};
			},
			inject: [PrismaService],
		}),
		ConfigModule.forRoot({
			isGlobal: true,
			load: [validateConfig],
			envFilePath: ".env",
		}),
		BullModule.forRoot({
			connection: {
				url: process.env.REDIS_URL,
			},
		}),
		RedisModule.forRoot({
			config: [
				{
					url: process.env.REDIS_URL,
				},
				{
					namespace: "runner-subscriber",
					url: process.env.REDIS_URL,
				},
			],
		}),
		RunnerModule,
		AiModule,
		WorkflowModule,
		AnalyticsModule,
		StorageModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
	controllers: [AppController],
})
export class AppModule {}
