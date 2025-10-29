import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { GitGraph, History, TestTube } from "lucide-react";
import {
	demoControllerGetDemoOptions,
	workflowControllerFindOneOptions,
} from "@/api-client/@tanstack/react-query.gen";
import { TabsList, TabsTrigger } from "../ui/tabs";
import FileMenu from "./nodes/panels/file-menu";

export default function WorkflowEditorMenubar({
	demoMode,
}: {
	demoMode?: boolean;
}) {
	const { id } = useParams({ strict: false });
	const options = demoMode
		? demoControllerGetDemoOptions({})
		: // biome-ignore lint/style/noNonNullAssertion: has to exist
			workflowControllerFindOneOptions({ path: { id: id! } });
	//@ts-expect-error
	const { data: workflow } = useQuery(options);
	return (
		<div className="grid grid-cols-3 justify-items-center border-b-2 p-4">
			<div className="flex items-center gap-4 justify-self-start">
				<img src="/android-chrome-512x512.png" alt="Logo" className="h-8 w-8" />
				<h3 className="text-xl">{workflow?.name}</h3>
				<FileMenu demoMode={demoMode} />
			</div>
			{/** biome-ignore lint/correctness/useUniqueElementIds: id needed for react joyride targeting */}
			<TabsList id="tabbar">
				<TabsTrigger value="editor">
					<GitGraph />
					Workflow Editor
				</TabsTrigger>
				<TabsTrigger value="history">
					<History />
					Previous runs
				</TabsTrigger>
				<TabsTrigger value="evaluations">
					<TestTube />
					Evaluations
				</TabsTrigger>
			</TabsList>
		</div>
	);
}
