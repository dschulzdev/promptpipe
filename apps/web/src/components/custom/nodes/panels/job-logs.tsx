import { Loader2 } from "lucide-react";
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
	const { data, error } = useJobUpdates();
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
						<TableHead>Log</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((log, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: test
						<TableRow key={index}>
							<TableCell>{JSON.stringify(log)}</TableCell>
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
