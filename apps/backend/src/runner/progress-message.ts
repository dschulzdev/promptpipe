import { NodeDataOutputDto } from "src/workflow/dto/node-data-output.dto";

export type ProgressMessage = {
	type: "progress" | "success_node" | "result";
	payload?: NodeDataOutputDto;
	log: string;
};

export type ResultMessage = ProgressMessage & {
	type: "result";
	result: "success" | "fail";
};
