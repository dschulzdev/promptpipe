import { PrismaClient } from "@generated/prisma";
import { BetterAuthOptions, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";

const authConfig = (prisma: PrismaClient) =>
	({
		baseURL: process.env.BETTER_AUTH_URL as string,
		trustedOrigins:
			process.env.NODE_ENV === "production"
				? [
						"https://promptpipe.dschulz.dev",
						"https://promptpipe-backend.dschulz.dev",
						"https://*.dschulz.dev",
					]
				: [
						process.env.FRONTEND_URL as string,
						"http://localhost:3000",
						"http://localhost:3001",
					],
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
				redirectURI:
					process.env.NODE_ENV === "production"
						? "https://promptpipe-backend.dschulz.dev/api/auth/callback/github"
						: undefined, // Use default for development
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
			crossSubDomainCookies: {
				// Use parent domain for production, undefined for localhost (allows different ports)
				domain:
					process.env.NODE_ENV === "production" ? ".dschulz.dev" : undefined,
				enabled: true,
			},
			// Force secure cookies in production
			useSecureCookies: process.env.NODE_ENV === "production",
			// Default cookie attributes for cross-domain support
			defaultCookieAttributes: {
				sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
				secure: process.env.NODE_ENV === "production",
				httpOnly: true,
				domain:
					process.env.NODE_ENV === "production" ? ".dschulz.dev" : undefined,
			},
			cookies: {
				session_token: {
					attributes: {
						sameSite: "none",
						secure: true,
						httpOnly: true,
						domain:
							process.env.NODE_ENV === "production"
								? ".dschulz.dev"
								: undefined,
					},
				},
			},
		},
	}) satisfies BetterAuthOptions;

export const auth = (prisma: PrismaClient) =>
	betterAuth(authConfig(prisma)) as ReturnType<
		typeof betterAuth<ReturnType<typeof authConfig>>
	>;
