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
	jwt: z.object({
		secret: z.string().min(1).default("your-secret-key"),
		expiresIn: z.string().default("1d"),
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
		jwt: {
			secret: process.env.JWT_SECRET,
			expiresIn: process.env.JWT_EXPIRES_IN,
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
