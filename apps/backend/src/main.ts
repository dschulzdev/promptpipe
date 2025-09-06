import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import "reflect-metadata";
import {
	BasicStartNodeDto,
	LlmNodeDto,
	TextGenerationNodeDto,
	TextInputNodeDto,
	TextOutputNodeDto,
} from "./workflow/dto/pipeline-node.dto";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { bodyParser: false });

	// Enable CORS
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

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => console.error(err));
