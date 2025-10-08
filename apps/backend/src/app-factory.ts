import { INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import type { Express, Request, Response } from "express";
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
		const appPromise = NestFactory.create(AppModule, adapter, {
			bodyParser: false,
		});

		appPromise
			.then((app) => {
				app.enableCors({
					origin: process.env.FRONTEND_URL, // Default Vite dev server port
					credentials: true,
					methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
					allowedHeaders: [
						"Content-Type",
						"Authorization",
						"Origin",
						"X-Requested-With",
						"Accept",
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
