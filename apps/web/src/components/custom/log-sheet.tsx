import { Logs } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
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
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Logs of your current run</SheetTitle>
					<JobLogs />
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
}
