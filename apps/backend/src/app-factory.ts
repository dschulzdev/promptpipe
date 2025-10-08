import { INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import type { Express } from "express";
import * as express from "express";
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
		const expressApp = express();
		const adapter = new ExpressAdapter(expressApp);
		const appPromise = NestFactory.create(AppModule, adapter, {
			bodyParser: false,
		});

		appPromise
			.then((app) => {
				app.enableCors({
					origin: process.env.FRONTEND_URL, // Default Vite dev server port
					credentials: true,
					methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
					allowedHeaders: ["Content-Type", "Authorization"],
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
		expressApp.use((_req: express.Request, _res: express.Response, next) => {
			appPromise
				.then(async (app) => {
					await app.init();
					next();
				})
				.catch((err) => next(err));
		});

		return { appPromise, expressApp };
	}
}
