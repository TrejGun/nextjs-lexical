import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import {
  $getSelection,
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
  PASTE_COMMAND,
} from "lexical";

import { INSERT_VIDEO_COMMAND } from "../../commands";
import { parseVideoUrl } from "../../utils/parseVideoUrl";
import { $createVideoNode } from "../../nodes/Video/VideoNode";

export const VideoPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeInsert = editor.registerCommand(
      INSERT_VIDEO_COMMAND,
      ({ url }) => {
        const parsed = parseVideoUrl(url);
        if (!parsed) return false;

        editor.update(() => {
          const node = $createVideoNode(parsed);
          const selection = $getSelection();
          void selection;
          $insertNodes([node]);
        });

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );

    const removePaste = editor.registerCommand(
      PASTE_COMMAND,
      (event: ClipboardEvent) => {
        const text = event.clipboardData?.getData("text/plain");
        if (!text) return false;

        const parsed = parseVideoUrl(text);
        if (!parsed) return false;

        event.preventDefault();
        editor.update(() => {
          const node = $createVideoNode(parsed);
          $insertNodes([node]);
        });
        return true;
      },
      COMMAND_PRIORITY_LOW,
    );

    return () => {
      removeInsert();
      removePaste();
    };
  }, [editor]);

  return null;
};
