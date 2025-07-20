import { SidebarClose, SidebarOpen } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

function SidebarToggle() {
	const { open, toggleSidebar } = useSidebar();
	return (
		<Button variant="outline" size="icon" onClick={toggleSidebar}>
			{open ? <SidebarClose /> : <SidebarOpen />}
		</Button>
	);
}

export default memo(SidebarToggle);
