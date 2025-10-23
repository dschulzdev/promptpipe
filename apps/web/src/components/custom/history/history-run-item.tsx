import { Loader2, MoreVertical } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import type { WorkflowHistoryDto } from "@/api-client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { logsIconMap as iconMap } from "@/constants/log-icon-map";
import useEditorState from "@/stores/editor-store";
import { DownloadLogButton } from "./download-log-button";

export default function HistoryRunItem({
	historyItem,
}: {
	historyItem: WorkflowHistoryDto;
}) {
	const { selectedPreviousRunId, setSelectedPreviousRunId } = useEditorState(
		useShallow((state) => ({
			selectedPreviousRunId: state.selectedPreviousRunId,
			setSelectedPreviousRunId: state.setSelectedPreviousRunId,
		})),
	);

	const selected = historyItem.id === selectedPreviousRunId;
	return (
		<Item
			variant={selected ? "muted" : "outline"}
			className="cursor-pointer"
			onClick={() => setSelectedPreviousRunId(historyItem.id)}
		>
			<ItemMedia>
				{iconMap[historyItem.status] || (
					<Loader2 className="h-4 w-4 text-gray-400" />
				)}
			</ItemMedia>
			<ItemContent>
				<ItemTitle>
					{new Date(historyItem.startedAt).toLocaleString()}
				</ItemTitle>
			</ItemContent>
			<ItemActions>
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
			</ItemActions>
		</Item>
	);
}
