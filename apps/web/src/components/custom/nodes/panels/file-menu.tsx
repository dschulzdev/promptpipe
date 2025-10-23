import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Edit, Loader2, Menu, Save } from "lucide-react";
import { memo, useState } from "react";
import { toast } from "sonner";
import { workflowControllerFindOneOptions } from "@/api-client/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import { useSimpleHotkey } from "@/hooks/hotkeys";
import useSaveFileMutation from "@/hooks/mutations/use-save-file-mutation";
import EditWorkflowDialog from "../../edit-workflow-dialog";

function FileMenu() {
	const { id } = useParams({ strict: false });
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	const { data: workflow } = useQuery(
		// biome-ignore lint/style/noNonNullAssertion: id has to exist here
		workflowControllerFindOneOptions({ path: { id: id! } }),
	);

	// biome-ignore lint/style/noNonNullAssertion: id has to exist, when being on this screen
	const { mutate, isPending } = useSaveFileMutation({ id: id! });

	useSimpleHotkey(
		"save",
		async () => {
			await mutate();
		},
		{ preventDefault: true },
		[id, mutate],
	);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size={"icon"}>
						<Menu />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="start">
					<DropdownMenuLabel className="font-bold">
						File actions
					</DropdownMenuLabel>
					<DropdownMenuGroup>
						<DropdownMenuItem
							disabled={isPending}
							className="flex items-center justify-start"
							onClick={async () => {
								if (!id) {
									toast.error("Error saving the workflow.");
									return;
								}
								await mutate();
							}}
						>
							{isPending ? <Loader2 className="animate-spin" /> : <Save />}
							Save
							<Kbd>⇧+S</Kbd>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								setIsEditDialogOpen(true);
							}}
						>
							<Edit />
							Edit
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<Link to="/app">
						<DropdownMenuItem>
							<ArrowLeft />
							Back to Workflow list
						</DropdownMenuItem>
					</Link>
				</DropdownMenuContent>
			</DropdownMenu>
			{workflow && (
				<EditWorkflowDialog
					workflow={workflow}
					open={isEditDialogOpen}
					onOpenChange={setIsEditDialogOpen}
				/>
			)}
		</>
	);
}

export default memo(FileMenu);
