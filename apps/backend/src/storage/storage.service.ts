import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StorageService {
	constructor(private readonly client: S3Client) {}

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
				Bucket: "promptpipe-dev",
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
			Bucket: "promptpipe-dev",
			Key: `logs/${userId}/${id}.json`,
			ResponseContentDisposition: "attachment", // Forces download
		});
		return await getSignedUrl(this.client, command, { expiresIn });
	}
}
