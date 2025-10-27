import {
	demoControllerGetDemoOptions,
	workflowControllerFindOneOptions,
} from "@/api-client/@tanstack/react-query.gen";
import type { EditorState } from "@/stores/editor-store";

export const getDemoOrWorkflowOptions = (
	mode: EditorState["mode"],
	id?: string,
) => {
	return {
		...(mode !== "demo" &&
			workflowControllerFindOneOptions({
				path: {
					// biome-ignore lint/style/noNonNullAssertion: id has to exist when not in demo mode
					id: id!,
				},
			})),
		...(mode === "demo" && demoControllerGetDemoOptions({})),
	};
};
