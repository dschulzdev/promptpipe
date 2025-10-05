import { SidebarClose, SidebarOpen } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useSimpleHotkey } from "@/hooks/hotkeys";

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
		<Button variant="outline" size="icon" onClick={toggleSidebar}>
			{open ? <SidebarClose /> : <SidebarOpen />}
		</Button>
	);
}

export default memo(SidebarToggle);
