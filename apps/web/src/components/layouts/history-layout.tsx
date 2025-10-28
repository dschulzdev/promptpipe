import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import useEditorState from "@/stores/editor-store";
import { findDemoOrWorkflowHistoryOptions } from "../../hooks/queries/demo-dependent-queries";
import { EmptyPreviousRuns } from "../custom/empty/empty-previous-runs";
import HistoryRunContent from "../custom/history/history-run-content";
import HistoryRunItem from "../custom/history/history-run-item";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "../ui/resizable";

export default function HistoryLayout() {
	const { id } = useParams({ strict: false });
	const mode = useEditorState((state) => state.mode);
	// biome-ignore lint/style/noNonNullAssertion: id should exist here
	const queryOptions = findDemoOrWorkflowHistoryOptions(mode, id!);
	const { data: workflowHistory } = useSuspenseQuery(queryOptions);
	if (workflowHistory && workflowHistory.length === 0) {
		return <EmptyPreviousRuns />;
	}

	return (
		<ResizablePanelGroup direction="horizontal" className="h-full flex-1">
			<ResizablePanel
				minSize={15}
				defaultSize={25}
				maxSize={40}
				className="h-full"
			>
				<div className="flex h-full flex-col gap-2 overflow-y-scroll p-2">
					{workflowHistory?.map((historyItem) => (
						<HistoryRunItem key={historyItem.id} historyItem={historyItem} />
					))}
				</div>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel>
				<HistoryRunContent />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
