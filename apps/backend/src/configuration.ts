import { z } from "zod";

// Define the configuration schema
const configSchema = z.object({
	nodeEnv: z
		.enum(["development", "staging", "production"])
		.default("development"),
	port: z.coerce.number().int().positive().default(3000),
	database: z.object({
		host: z.string().min(1).default("localhost"),
		port: z.coerce.number().int().positive().default(5432),
		username: z.string().min(1).default("postgres"),
		password: z.string().min(1).default("password"),
		database: z.string().min(1).default("promptpipe"),
	}),
	ai: z.object({
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
		database: {
			host: process.env.DATABASE_HOST,
			port: process.env.DATABASE_PORT,
			username: process.env.DATABASE_USERNAME,
			password: process.env.DATABASE_PASSWORD,
			database: process.env.DATABASE_NAME,
		},
		ai: {
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
