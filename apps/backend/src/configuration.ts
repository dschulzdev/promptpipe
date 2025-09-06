import { z } from "zod";

// Define the configuration schema
const configSchema = z.object({
	nodeEnv: z
		.enum(["development", "staging", "production"])
		.default("development"),
	port: z.coerce.number().int().positive().default(3000),
	posthog_api_key: z.string().min(1),

	frontend_url: z.string().min(1),
	database_url: z.string().min(1),
	ai: z.object({
		openrouter: z.string().min(1).optional(),
		openai: z.object({
			apiKey: z.string().min(1).optional(),
		}),
		google: z.object({
			apiKey: z.string().min(1).optional(),
		}),
	}),
	auth: z.object({
		betterAuthSecret: z.string().min(1),
		betterAuthUrl: z.string().min(1),
		socialProviders: z.object({
			github: z.object({
				clientId: z.string().min(1),
				clientSecret: z.string().min(1),
			}),
		}),
	}),
});

// Export the type for use in services
export type Configuration = z.infer<typeof configSchema>;

// Validate and export the configuration
export const validateConfig = () => {
	const config = {
		nodeEnv: process.env.NODE_ENV,
		port: process.env.PORT,
		posthog_api_key: process.env.POSTHOG_API_KEY,
		frontend_url: process.env.FRONTEND_URL,
		database_url: process.env.DATABASE_URL,
		ai: {
			openrouter: process.env.OPENROUTER_KEY,
			openai: {
				apiKey: process.env.OPENAI_API_KEY,
			},
			google: {
				apiKey: process.env.GOOGLE_API_KEY,
			},
		},
		auth: {
			betterAuthSecret: process.env.BETTER_AUTH_SECRET,
			betterAuthUrl: process.env.BETTER_AUTH_URL,
			socialProviders: {
				github: {
					clientId: process.env.GITHUB_CLIENT_ID,
					clientSecret: process.env.GITHUB_CLIENT_SECRET,
				},
			},
		},
	};

	try {
		return configSchema.parse(config);
	} catch (error) {
		console.error("Configuration validation failed:", error);
		process.exit(1);
	}
};

export default validateConfig;
