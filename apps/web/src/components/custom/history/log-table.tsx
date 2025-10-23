import type { ProgressMessageWithTypeDto } from "@/api-client";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { logsIconMap as iconMap } from "@/constants/log-icon-map";

export default function LogTable({
	data,
}: {
	data: ProgressMessageWithTypeDto[];
}) {
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
						// biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here because log entries are static and not reordered.
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
		</ScrollArea>
	);
}
