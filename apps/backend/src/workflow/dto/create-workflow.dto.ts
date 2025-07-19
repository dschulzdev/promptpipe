import { IsJSON, IsNotEmpty, IsString } from "class-validator";

export class CreateWorkflowDto {
	@IsString()
	@IsNotEmpty()
	name: string;
	@IsJSON()
	nodes: Record<string, any>;
	@IsJSON()
	connections: Record<string, any>;
}
