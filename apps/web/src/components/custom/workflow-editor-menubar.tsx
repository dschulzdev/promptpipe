import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { BrainCircuit, GitGraph, History, TestTube } from "lucide-react";
import { workflowControllerFindOneOptions } from "@/api-client/@tanstack/react-query.gen";
import { TabsList, TabsTrigger } from "../ui/tabs";
import FileMenu from "./nodes/panels/file-menu";

export default function WorkflowEditorMenubar() {
	const { id } = useParams({ strict: false });
	const { data: workflow } = useQuery(
		// biome-ignore lint/style/noNonNullAssertion: exists
		workflowControllerFindOneOptions({ path: { id: id! } }),
	);
	return (
		<div className="grid grid-cols-3 justify-items-center border-b-2 p-4">
			<div className="flex items-center gap-2 justify-self-start">
				<img
					src="/android-chrome-512x512.png"
					alt="Logo"
					className="mr-4 h-8 w-8"
				/>
				<h3 className="text-xl">{workflow?.name}</h3>
				<FileMenu />
			</div>
			<TabsList>
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
