import useEditorState from "@/stores/editor-store";

export const useEditorMode = () => {
	return useEditorState((state) => state.mode);
};
