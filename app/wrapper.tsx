"use client";

import dynamic from "next/dynamic";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ToolbarContext } from "./editor/context/ToolbarContext";
import { SharedHistoryContext } from "./editor/context/SharedHistoryContext";
import PlaygroundNodes from "./editor/nodes/PlaygroundNodes";

import "./editor/index.css";

const MyEditor = dynamic(() => import("./editor/Editor"), { ssr: false });

export default function Wrapper() {
  return (
    <LexicalComposer
      initialConfig={{
        editorState: null,
        namespace: "Playground",
        nodes: [...PlaygroundNodes],
        onError: (error: Error) => {
          throw error;
        },
      }}
    >
      <SharedHistoryContext>
        <ToolbarContext>
          <MyEditor />
        </ToolbarContext>
      </SharedHistoryContext>
    </LexicalComposer>
  );
}
