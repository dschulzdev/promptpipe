import { CheckCheck, CheckCircle, Loader2, Logs } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
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
	const { data, error } = useJobUpdates() as {
		data: { type: string; payload: { log: string } }[];
		error: Error | null;
	};
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

	const iconMap: Record<string, React.ReactNode> = {
		log: <Logs className="h-4 w-4 text-blue-400" />,
		progress_node: <Loader2 className="h-4 w-4 text-yellow-600" />,
		success_node: <CheckCircle className="h-4 w-4 text-green-400" />,
		result_success: <CheckCheck className="h-4 w-4 text-green-700" />,
	};

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
							<Popover>
								<PopoverTrigger className="flex w-full flex-row items-center justify-start">
									<TableCell>{iconMap[log.type]}</TableCell>
									<TableCell>{log.payload.log}</TableCell>
								</PopoverTrigger>
								<PopoverContent>{log.payload.log}</PopoverContent>
							</Popover>
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
