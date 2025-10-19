import { S3Client } from "@aws-sdk/client-s3";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Configuration } from "../configuration";
import { StorageService } from "./storage.service";

@Module({
	providers: [
		StorageService,
		{
			provide: S3Client,
			useFactory: (configService: ConfigService<Configuration>) => {
				return new S3Client({
					region: "auto",
					endpoint: configService.getOrThrow("storage.s3_endpoint", {
						infer: true,
					}),
					credentials: {
						accessKeyId: configService.getOrThrow("storage.access_key_id", {
							infer: true,
						}),
						secretAccessKey: configService.getOrThrow(
							"storage.secret_access_key",
							{
								infer: true,
							},
						),
					},
				});
			},
			inject: [ConfigService],
		},
	],
	exports: [StorageService],
})
export class StorageModule {}
