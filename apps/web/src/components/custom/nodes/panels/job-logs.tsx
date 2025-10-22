import { Loader2 } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { logsIconMap as iconMap } from "@/constants/log-icon-map";
import { useJobUpdates } from "@/hooks/use-job-updates";
import useRunnerStore from "@/stores/runner-store";
import { ScrollArea } from "../../../ui/scroll-area";
import { SheetDescription } from "../../../ui/sheet";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../../ui/table";

export default function JobLogs() {
	// Define a proper interface for individual job log entries
	interface JobLogData {
		type: string;
		payload: { log: string };
	}

	// Define the shape of the hook’s return value
	interface UseJobUpdatesReturn {
		data: JobLogData[];
		error: Error | null;
	}

	// Replace the inline assertion with the named interface
	const { data, error } = useJobUpdates() as UseJobUpdatesReturn;
	const connectedToUpdateStream = useRunnerStore(
		(state) => state.connectedToUpdateStream,
	);
	if (error) {
		return (
			<SheetDescription>
				Error loading job logs: {error.message}
			</SheetDescription>
		);
	}

	return (
		<ScrollArea className="h-full">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-4">Type</TableHead>
						<TableHead className="w-full">Logs</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((log, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: test
						<TableRow key={index}>
							<TableCell>{iconMap[log.type] || iconMap.default}</TableCell>
							<TableCell>
								<Popover>
									<PopoverTrigger className="text-left">
										{log.payload.log}
									</PopoverTrigger>
									<PopoverContent>{log.payload.log}</PopoverContent>
								</Popover>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{connectedToUpdateStream && (
				<div className="flex h-8 w-full flex-row items-center justify-center p-4">
					<Loader2 className="animate-spin" />
				</div>
			)}
		</ScrollArea>
	);
}
