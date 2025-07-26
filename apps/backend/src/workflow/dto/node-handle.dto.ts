import { IsEnum, IsString } from "class-validator";

export enum HandleType {
	source = "source",
	target = "target",
}
export class NodeHandleDto {
	@IsString()
	id: string;
	@IsEnum(HandleType)
	type: HandleType;
}
