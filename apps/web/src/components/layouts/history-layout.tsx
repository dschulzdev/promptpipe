import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Download, MoreVertical } from "lucide-react";
import {
	workflowControllerDownloadHistoryOptions,
	workflowControllerFindHistoryOptions,
} from "@/api-client/@tanstack/react-query.gen";
import { useLogDownload } from "@/hooks/use-log-download";
import { EmptyPreviousRuns } from "../custom/empty/empty-previous-runs";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function HistoryLayout() {
	const { id } = useParams({ strict: false });
	const { data: workflowHistory } = useSuspenseQuery({
		// biome-ignore lint/style/noNonNullAssertion: id should exist here
		...workflowControllerFindHistoryOptions({ path: { id: id! } }),
	});
	if (workflowHistory && workflowHistory.length === 0) {
		return <EmptyPreviousRuns />;
	}

	return (
		<div>
			{workflowHistory?.map((historyItem) => (
				<div key={historyItem.id} className="mb-2 rounded border p-4">
					<h3 className="font-bold">Run ID: {historyItem.id}</h3>
					<p>Status: {historyItem.status}</p>
					<p>Started At: {new Date(historyItem.startedAt).toLocaleString()}</p>
					{historyItem.completedAt && (
						<p>
							Completed At: {new Date(historyItem.completedAt).toLocaleString()}
						</p>
					)}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="secondary" size="sm">
								<MoreVertical />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DownloadLogButton runId={historyItem.id} />
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			))}
		</div>
	);
}

export function DownloadLogButton({ runId }: { runId: string }) {
	const { id } = useParams({ strict: false });
	const { refetch: downloadLog } = useLogDownload(
		// biome-ignore lint/style/noNonNullAssertion: id should exist here
		id!,
		runId,
	);
	return (
		<DropdownMenuItem
			onClick={() => {
				downloadLog();
			}}
		>
			<Download />
			Download logs
		</DropdownMenuItem>
	);
}
