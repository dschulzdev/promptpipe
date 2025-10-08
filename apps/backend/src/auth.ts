import { PrismaClient } from "@generated/prisma";
import { BetterAuthOptions, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";

// TODO: Implement using Async Injection in the future
const isProd = process.env.NODE_ENV === "production";

const authConfig = (prisma: PrismaClient) =>
	({
		trustedOrigins: [process.env.FRONTEND_URL as string],
		database: prismaAdapter(prisma, {
			provider: "postgresql", // or "mysql", "sqlite"
		}),
		emailAndPassword: {
			enabled: false,
		},
		socialProviders: {
			github: {
				enabled: true,
				clientId: process.env.GITHUB_CLIENT_ID as string,
				clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
			},
		},
		databaseHooks: {
			user: {
				create: {
					after: async (user) => {
						try {
							await prisma.applicationUser.create({
								data: {
									userId: user.id,
								},
							});
							console.log(`ApplicationUser created for user ${user.id}`);
						} catch (error) {
							console.error(
								`Failed to create ApplicationUser for user ${user.id}:`,
								error,
							);
							// Throw an APIError to rollback the entire user creation transaction
							throw new APIError("INTERNAL_SERVER_ERROR", {
								message:
									"Failed to create application user profile. Please try again.",
							});
						}
					},
				},
			},
		},
		// Cookie setup for backend-frontend authentication in production and development
		advanced: {
			cookies: {
				session_token: {
					attributes: {
						sameSite: isProd ? "none" : "lax",
						secure: isProd,
						httpOnly: true,
					},
				},
			},
		},
	}) satisfies BetterAuthOptions;

export const auth = (prisma: PrismaClient) =>
	betterAuth(authConfig(prisma)) as ReturnType<
		typeof betterAuth<ReturnType<typeof authConfig>>
	>;
