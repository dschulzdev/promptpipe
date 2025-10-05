import { useHotkeys } from "react-hotkeys-hook";
import type { OptionsOrDependencyArray } from "react-hotkeys-hook/packages/react-hotkeys-hook/dist/types";

export const hotkeyMap = {
	save: {
		hotkey: "shift+s",
		visualRepresentation: "⇧+S",
	},
	toggle_sidebar: {
		hotkey: "shift+m",
		visualRepresentation: "⇧+M",
	},
	toggle_logs: {
		hotkey: "shift+l",
		visualRepresentation: "⇧+L",
	},
	run_workflow: {
		hotkey: "shift+p",
		visualRepresentation: "⇧+P",
	},
} as const satisfies Record<
	string,
	{
		hotkey: string;
		visualRepresentation: string;
	}
>;

export type HotkeyAction = keyof typeof hotkeyMap;

export const useSimpleHotkey = (
	hotkey: HotkeyAction,
	action: (event?: KeyboardEvent) => void,
	additionalOptions?: OptionsOrDependencyArray,
	dependencies?: OptionsOrDependencyArray,
) => {
	return useHotkeys(
		hotkeyMap[hotkey].hotkey,
		action,
		{
			preventDefault: true,
			...additionalOptions,
		},
		dependencies ?? [],
	);
};
