import { PrismaClient } from "@generated/prisma"; // Adjust the import path as necessary
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { demoWorkflow } from "../demo/demo-data";

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	async onModuleInit() {
		await this.$connect();
		//Seed data
		await this.applicationUser.upsert({
			create: {
				id: "demo",
				user: {
					connectOrCreate: {
						create: {
							id: "demo",
							email: "demo@example.com",
							name: "Demo User",
						},
						where: {
							id: "demo",
						},
					},
				},
				workflows: {
					connectOrCreate: {
						create: {
							...demoWorkflow,
						},
						where: {
							id: "demo",
						},
					},
				},
			},
			update: {},
			where: { id: "demo" },
		});
	}

	async onModuleDestroy() {
		await this.$disconnect();
	}
}
