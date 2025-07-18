import { IsString } from "class-validator";

export class PipelineConnectionDto {
	// Define the properties of the PipelineConnectionDto here
	// For example:

	@IsString()
	id: string;
	@IsString()
	sourceNodeId: string;
	@IsString()
	targetNodeId: string;
}
