import { useParams } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useLogDownload } from "@/hooks/use-log-download";

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
