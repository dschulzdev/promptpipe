import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PostHog } from "posthog-node";
import { Configuration } from "../configuration";
import { AnalyticsService } from "./analytics.service";

@Module({
	providers: [
		AnalyticsService,
		{
			provide: PostHog,
			useFactory: (configService: ConfigService<Configuration>) =>
				new PostHog(
					configService.getOrThrow("posthog_api_key", { infer: true }),
					{
						host: "https://eu.i.posthog.com",
					},
				),
			inject: [ConfigService],
		},
	],
	exports: [AnalyticsService],
})
export class AnalyticsModule {}
