import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config/dist/config.service";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { AnalyticsModule } from "src/analytics/analytics.module";
import type { Configuration } from "src/configuration";
import { AiService } from "./ai.service";

@Module({
	imports: [AnalyticsModule],
	controllers: [],
	providers: [
		{
			provide: "OPENAI_CLIENT",
			useFactory: (configService: ConfigService<Configuration>) => {
				return createOpenAI({
					apiKey: configService.get("ai.openai.apiKey", { infer: true }),
				});
			},
			inject: [ConfigService],
		},
		{
			provide: "GOOGLE_CLIENT",
			useFactory: (configService: ConfigService<Configuration>) => {
				return createGoogleGenerativeAI({
					apiKey: configService.get("ai.google.apiKey", { infer: true }),
				});
			},
			inject: [ConfigService],
		},
		{
			provide: "OPENROUTER_CLIENT",
			useFactory: (configService: ConfigService<Configuration>) => {
				return createOpenRouter({
					apiKey: configService.get("ai.openrouter", { infer: true }),
				});
			},
			inject: [ConfigService],
		},
		AiService,
	],
	exports: [AiService],
})
export class AiModule {}
