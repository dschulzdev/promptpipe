import { PrismaClient } from "@generated/prisma";
import { BetterAuthOptions, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// TODO: Implement using Async Injection in the future
const prisma = new PrismaClient();

const authConfig = {
	database: prismaAdapter(prisma, {
		provider: "postgresql", // or "mysql", "sqlite"
	}),
	emailAndPassword: {
		enabled: false,
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		},
	},
} satisfies BetterAuthOptions;

export const auth = betterAuth(authConfig) as ReturnType<
	typeof betterAuth<typeof authConfig>
>;
