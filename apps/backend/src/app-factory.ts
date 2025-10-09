import { INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import type { Express, NextFunction, Request, Response } from "express";
import { AppModule } from "./app.module";
import "reflect-metadata";
import {
	BasicStartNodeDto,
	LlmNodeDto,
	TextGenerationNodeDto,
	TextInputNodeDto,
	TextOutputNodeDto,
} from "./workflow/dto/pipeline-node.dto";

export class AppFactory {
	static create(): {
		// biome-ignore lint/suspicious/noExplicitAny: type not relevant
		appPromise: Promise<INestApplication<any>>;
		expressApp: Express;
	} {
		const adapter = new ExpressAdapter();
		const expressApp = adapter.getInstance();

		// Apply CORS middleware directly to Express instance for Vercel serverless
		const allowedOrigins =
			process.env.NODE_ENV === "production"
				? [
						"https://promptpipe.dschulz.dev",
						"https://promptpipe-backend.dschulz.dev",
					]
				: [process.env.FRONTEND_URL || "http://localhost:5173"];

		expressApp.use((req: Request, res: Response, next: NextFunction) => {
			const origin = req.headers.origin;
			if (origin && allowedOrigins.includes(origin)) {
				res.setHeader("Access-Control-Allow-Origin", origin);
			}
			res.setHeader("Access-Control-Allow-Credentials", "true");
			res.setHeader(
				"Access-Control-Allow-Methods",
				"GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD",
			);
			res.setHeader(
				"Access-Control-Allow-Headers",
				"Content-Type, Authorization, Origin, X-Requested-With, Accept, Cookie",
			);

			// Handle preflight requests
			if (req.method === "OPTIONS") {
				res.status(204).end();
				return;
			}

			next();
		});

		expressApp.set("trust proxy", true);

		const appPromise = NestFactory.create(AppModule, adapter, {
			bodyParser: false,
		});

		appPromise
			.then((app) => {
				app.enableCors({
					origin:
						process.env.NODE_ENV === "production"
							? [
									"https://promptpipe.dschulz.dev",
									"https://promptpipe-backend.dschulz.dev",
								]
							: process.env.FRONTEND_URL, // Default Vite dev server port
					credentials: true,
					methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
					allowedHeaders: [
						"Content-Type",
						"Authorization",
						"Origin",
						"X-Requested-With",
						"Accept",
						"Cookie",
					],
				});
				app.useGlobalPipes(
					new ValidationPipe({
						whitelist: true,
						transform: true,
						forbidNonWhitelisted: true,
					}),
				);
				app.enableShutdownHooks();

				if (process.env.NODE_ENV !== "production") {
					const config = new DocumentBuilder()
						.setTitle("PromptPipe API")
						.setDescription("The API documentation for the PromptPipe backend.")
						.setVersion("1.0")
						.build();

					const document = SwaggerModule.createDocument(app, config, {
						extraModels: [
							LlmNodeDto,
							BasicStartNodeDto,
							TextInputNodeDto,
							TextOutputNodeDto,
							TextGenerationNodeDto,
						],
					});
					SwaggerModule.setup("api", app, document);
				}
			})
			.catch((err) => {
				throw err;
			});

		// IMPORTANT This express application-level middleware makes sure the NestJS app is fully initialized
		// @ts-expect-error
		adapter.getInstance().use((_req: Request, _res: Response, next) => {
			appPromise
				.then(async (app) => {
					await app.init();
					next();
				})
				.catch((err) => next(err));
		});

		return { appPromise, expressApp: adapter.getInstance() };
	}
}
