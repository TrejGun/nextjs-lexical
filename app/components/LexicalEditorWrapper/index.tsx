"use client";

import { $getRoot, $getSelection, EditorState } from "lexical";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { Box, Divider } from "@mui/material";

import { MuiContentEditable, placeHolderSx } from "./styles";
import { lexicalEditorConfig } from "../../config/lexicalEditorConfig";
import { LexicalEditorTopBar } from "../LexicalEditorTopBar";

export const LexicalEditorWrapper = () => {
  // When the editor changes, you can get notified via the
  // LexicalOnChangePlugin!
  function onChange(editorState: EditorState) {
    editorState.read(() => {
      // Read the contents of the EditorState here.
      const root = $getRoot();
      const selection = $getSelection();

      console.info(root, selection);
    });
  }

  return (
    <LexicalComposer initialConfig={lexicalEditorConfig}>
      <LexicalEditorTopBar />
      <Divider />
      <Box sx={{ position: "relative", background: "white" }}>
        <RichTextPlugin // #312D4B
          contentEditable={<MuiContentEditable />}
          placeholder={<Box sx={placeHolderSx}>Enter some text...</Box>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
      </Box>
    </LexicalComposer>
  );
};
