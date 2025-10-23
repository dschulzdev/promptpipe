import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import useEditorState from "@/stores/editor-store";
import { workflowControllerGetLogForHistoryOptions } from "../../../api-client/@tanstack/react-query.gen";
import NoRunSelected from "../empty/no-run-selected";
import LogTable from "./log-table";

export default function HistoryRunContent() {
	const { id } = useParams({ strict: false });
	const selectedPreviousRunId = useEditorState(
		(state) => state.selectedPreviousRunId,
	);

	const { data, isLoading } = useQuery({
		...workflowControllerGetLogForHistoryOptions({
			// biome-ignore lint/style/noNonNullAssertion: id has to exist
			path: { runId: selectedPreviousRunId!, id: id! },
		}),
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
