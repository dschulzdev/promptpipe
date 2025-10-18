import { SquareDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import useEditorState from "@/stores/editor-store";

export function EmptyPreviousRuns() {
	const setSelectedTab = useEditorState((state) => state.setSelectedTab);
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<SquareDashed />
				</EmptyMedia>
				<EmptyTitle>No previously recorded workflow runs</EmptyTitle>
				<EmptyDescription>
					It seems like you haven't run any workflows yet. Get started by going
					back to the editor and starting a workflow run.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<div className="flex gap-2">
					<Button onClick={() => setSelectedTab("editor")}>
						Back to editor
					</Button>
				</div>
			</EmptyContent>
		</Empty>
	);
}
