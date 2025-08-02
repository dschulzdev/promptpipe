export type ProgressMessage<T = unknown> = {
	payload?: {
		nodeId: string;
		data?: T;
	};
	log: string;
};

export type ProgressMessageWithType = {
	type: ProgressType;
	payload: ProgressMessage;
};

export type ProgressType =
	| "log"
	| "progress_node"
	| "success_node"
	| "result_success"
	| "result_fail"
	| "fail_node";
