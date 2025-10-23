import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { plainToInstance } from "class-transformer";
import { ProgressMessageWithTypeDto } from "../runner/dto/progress-message-with-type.dto";

@Injectable()
export class StorageService {
	constructor(
		private readonly client: S3Client,
		private readonly configService: ConfigService,
	) {}

	public async storeLog({
		id,
		userId,
		content,
	}: {
		id: string;
		userId: string;
		content: unknown;
	}): Promise<void> {
		await this.client.send(
			new PutObjectCommand({
				Bucket: this.configService.get("AWS_S3_BUCKET_NAME"),
				Key: `logs/${userId}/${id}.json`,
				Body: JSON.stringify(content),
			}),
		);
	}

	public async getSignedLogUrl({
		id,
		userId,
		expiresIn = 3600,
	}: {
		id: string;
		userId: string;
		expiresIn?: number;
	}): Promise<string> {
		const command = new GetObjectCommand({
			Bucket: this.configService.get("AWS_S3_BUCKET_NAME"),
			Key: `logs/${userId}/${id}.json`,
			ResponseContentDisposition: "attachment", // Forces download
		});
		return await getSignedUrl(this.client, command, { expiresIn });
	}

	public async getLogById({
		id,
		userId,
	}: {
		id: string;
		userId: string;
	}): Promise<ProgressMessageWithTypeDto[]> {
		const command = new GetObjectCommand({
			Bucket: this.configService.get("AWS_S3_BUCKET_NAME"),
			Key: `logs/${userId}/${id}.json`,
			ResponseContentDisposition: "attachment", // Forces download
		});
		const result = await this.client.send(command);
		if (!result.Body) {
			throw new NotFoundException("Log not found");
		}

		const parsedResult = JSON.parse(
			await result.Body.transformToString(),
		) as Array<unknown>;
		return parsedResult.map((item) =>
			plainToInstance(ProgressMessageWithTypeDto, item),
		);
	}
}
