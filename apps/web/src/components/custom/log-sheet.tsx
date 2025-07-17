import { Logs } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "../ui/sheet";
import JobLogs from "./job-logs";

export default function LogSheet() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant={"outline"}>
					<Logs />
				</Button>
			</SheetTrigger>
			<SheetContent className="flex h-full w-full flex-col">
				<SheetHeader>
					<SheetTitle>Logs of your current run</SheetTitle>
					<SheetDescription>
						Run logs are streamed in real-time. You can view the logs of your
						current run here.
					</SheetDescription>
				</SheetHeader>
				<div className="flex-1 overflow-hidden p-4">
					<JobLogs />
				</div>
			</SheetContent>
		</Sheet>
	);
}
