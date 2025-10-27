import { create } from "zustand";

export type EditorState = {
	mode: "edit" | "demo";
	selectedTab: "editor" | "history" | "evaluations";
	selectedPreviousRunId?: string;
};

export type EditorStoreActions = {
	setSelectedTab: (tab: string) => void;
	setSelectedPreviousRunId: (id: string) => void;
	setMode: (mode: EditorState["mode"]) => void;
};

const initialEditorState: EditorState = {
	mode: "edit",
	selectedTab: "editor",
	selectedPreviousRunId: undefined,
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useEditorState = create<EditorState & EditorStoreActions>((set) => ({
	...initialEditorState,
	setMode: (mode) => set({ mode }),
	setSelectedTab: (tab) =>
		set({ selectedTab: tab as EditorState["selectedTab"] }),
	setSelectedPreviousRunId: (id) => set({ selectedPreviousRunId: id }),
}));

export default useEditorState;
