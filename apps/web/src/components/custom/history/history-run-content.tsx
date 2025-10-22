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

	// biome-ignore lint/style/noNonNullAssertion: idk how data can be undefined here
	return <LogTable data={data!} />;
}
