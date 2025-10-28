import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { RunnerModule } from "../runner/runner.module";
import { StorageModule } from "../storage/storage.module";
import { DemoController } from "./demo.controller";
import { DemoService } from "./demo.service";

@Module({
	imports: [RunnerModule, StorageModule, PrismaModule],
	providers: [DemoService],
	controllers: [DemoController],
})
export class DemoModule {}
