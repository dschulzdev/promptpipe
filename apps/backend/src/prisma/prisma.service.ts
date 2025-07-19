import { PrismaClient } from "@generated/prisma"; // Adjust the import path as necessary
import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	async onModuleInit() {
		await this.$connect();
	}
}
