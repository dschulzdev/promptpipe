import { IsEnum, IsString } from "class-validator";

export class NodeHandleDto {
	@IsString()
	id: string;
	@IsEnum(["source", "target"])
	type: "source" | "target";
	@IsString()
	handleKey: string;
}
