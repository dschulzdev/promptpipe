import { Injectable } from "@nestjs/common";
import { PostHog } from "posthog-node";

@Injectable()
export class AnalyticsService {
	constructor(private readonly posthog: PostHog) {}

	getClient() {
		return this.posthog;
	}
}
