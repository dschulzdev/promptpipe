import { Target } from "lucide-react";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export default function NoRunSelected() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Target className="h-12 w-12 text-muted-foreground" />
				</EmptyMedia>
				<EmptyTitle>No run selected</EmptyTitle>
				<EmptyDescription>
					Click on a previous run in the sidebar on the left to select it and
					view its logs.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
