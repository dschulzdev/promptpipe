import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Menu, Save } from "lucide-react";
import { memo } from "react";
import { toast } from "sonner";
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

function FileMenu() {
	const { id } = useParams({ strict: false });
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
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<Link to="/">
					<DropdownMenuItem>
						<ArrowLeft />
						Back to Workflow list
					</DropdownMenuItem>
				</Link>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default memo(FileMenu);
