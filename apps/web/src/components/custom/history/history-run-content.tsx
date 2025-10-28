import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { getLogForDemoOrWorkflowHistoryOptions } from "@/hooks/queries/demo-dependent-queries";
import { useEditorMode } from "@/hooks/use-editor-mode";
import useEditorState from "@/stores/editor-store";
import NoRunSelected from "../empty/no-run-selected";
import LogTable from "./log-table";

export default function HistoryRunContent() {
	const { id } = useParams({ strict: false });
	const selectedPreviousRunId = useEditorState(
		(state) => state.selectedPreviousRunId,
	);
	const mode = useEditorMode();

	const { data, isLoading } = useQuery({
		...getLogForDemoOrWorkflowHistoryOptions(
			mode,
			// biome-ignore lint/style/noNonNullAssertion: id has to exist here
			id!,
			// biome-ignore lint/style/noNonNullAssertion: selectedPreviousRunId has to exist here
			selectedPreviousRunId!,
		),
		enabled: !!selectedPreviousRunId,
	});

	if (!selectedPreviousRunId) {
		return <NoRunSelected />;
	}

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!data) {
		// data can be undefined if the query fails or returns no data
		return <div>No log data available.</div>;
	}
	return <LogTable data={data} />;
}
