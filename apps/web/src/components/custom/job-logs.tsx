import { useJobUpdates } from "@/hooks/use-job-updates";
import { SheetDescription } from "../ui/sheet";

export default function JobLogs() {
	const { data, error } = useJobUpdates();
	if (error) {
		return (
			<SheetDescription>
				Error loading job logs: {error.message}
			</SheetDescription>
		);
	}

	return (
		<>
			<SheetDescription>
				Run logs are streamed in real-time. You can view the logs of your
				current run here.
			</SheetDescription>
			{data.map((log, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: test
				<div key={index}>
					<p>{JSON.stringify(log)}</p>
				</div>
			))}
		</>
	);
}
