import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import "reflect-metadata";
import { BasicStartNodeDataDto } from "./workflow/dto/basic-start-node-data.dto";
import { LLMNodeDataDto } from "./workflow/dto/llm-node-data.dto";
import { TextGenerationNodeDataDto } from "./workflow/dto/text-generation-node-data.dto";
import { TextInputNodeDataDto } from "./workflow/dto/text-input-node-data.dto";
import { TextOutputNodeDataDto } from "./workflow/dto/text-output-node-data.dto";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

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

	const config = new DocumentBuilder()
		.setTitle("PromptPipe API")
		.setDescription("The API documentation for the PromptPipe backend.")
		.setVersion("1.0")
		.build();

	const document = SwaggerModule.createDocument(app, config, {
		extraModels: [
			BasicStartNodeDataDto,
			LLMNodeDataDto,
			TextGenerationNodeDataDto,
			TextInputNodeDataDto,
			TextOutputNodeDataDto,
		],
	});
	SwaggerModule.setup("api", app, document);

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => console.error(err));
