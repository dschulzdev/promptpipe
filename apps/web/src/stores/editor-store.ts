import { create } from "zustand";

export type EditorState = {
	selectedTab: "editor" | "history" | "evaluations";
};

export type EditorStoreActions = {
	setSelectedTab: (tab: string) => void;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useEditorState = create<EditorState & EditorStoreActions>((set) => ({
	selectedTab: "editor",
	setSelectedTab: (tab) =>
		set({ selectedTab: tab as EditorState["selectedTab"] }),
}));

export default useEditorState;
