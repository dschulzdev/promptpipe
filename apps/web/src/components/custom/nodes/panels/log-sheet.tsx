import { Logs } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSimpleHotkey } from "@/hooks/hotkeys";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "../../../ui/sheet";
import JobLogs from "./job-logs";

export default function LogSheet() {
	const [open, setOpen] = useState(false);

	useSimpleHotkey(
		"toggle_logs",
		() => {
			setOpen((prev) => !prev);
		},
		{},
		[setOpen],
	);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant={"outline"}>
					<Logs />
				</Button>
			</SheetTrigger>
			<SheetContent className="flex h-full w-full flex-col outline-0">
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
