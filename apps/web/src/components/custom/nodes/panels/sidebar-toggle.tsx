import { SidebarClose, SidebarOpen } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useSidebar } from "@/components/ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { hotkeyMap, useSimpleHotkey } from "@/hooks/hotkeys";

function SidebarToggle() {
	const { open, toggleSidebar } = useSidebar();
	useSimpleHotkey(
		"toggle_sidebar",
		() => {
			toggleSidebar();
		},
		{},
		[toggleSidebar],
	);
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button variant="outline" size="icon" onClick={toggleSidebar}>
					{open ? <SidebarClose /> : <SidebarOpen />}
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>
					{open ? "Close Sidebar " : "Open Sidebar "}
					<Kbd>{hotkeyMap.toggle_sidebar.visualRepresentation}</Kbd>
				</p>
			</TooltipContent>
		</Tooltip>
	);
}

export default memo(SidebarToggle);
