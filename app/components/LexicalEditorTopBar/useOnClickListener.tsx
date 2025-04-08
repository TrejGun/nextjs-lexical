import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  RangeSelection,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from "@lexical/rich-text";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isAtNodeEnd, $isParentElementRTL, $wrapNodes } from "@lexical/selection";

import { eventTypes } from "./toolbarIconsList";
import useModal from "../../common/hooks/useModal";

const LowPriority = 1;

const useOnClickListener = () => {
  const [editor] = useLexicalComposerContext();
  const [modal, _showModal] = useModal();
  const [blockType, setBlockType] = useState("paragraph");
  const [_selectedElementKey, setSelectedElementKey] = useState<string | null>(
    null,
  );
  const [_isRTL, setIsRTL] = useState(false);
  const [isLink, setIsLink] = useState(false);

  const [selectedEventTypes, setSelectedEventTypes] = useState<Array<string>>(
    [],
  );

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    let allSelectedEvents = [...selectedEventTypes];

    // inner function

    const pushInEventTypesState = (selectionFormat: boolean, event: string) => {
      if (selectionFormat) {
        if (selectedEventTypes.includes(event)) {
          return;
        } else {
          allSelectedEvents.push(event);
        }
      } else {
        allSelectedEvents = allSelectedEvents.filter((ev) => ev !== event);
      }
    };

    // range selection ( e.g like to bold only the particular area of the text)
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();

          setBlockType(type);
        }
      }

      pushInEventTypesState(selection.hasFormat("bold"), eventTypes.formatBold);
      pushInEventTypesState(
        selection.hasFormat("italic"),
        eventTypes.formatItalic,
      );
      pushInEventTypesState(
        selection.hasFormat("underline"),
        eventTypes.formatUnderline,
      );
      pushInEventTypesState(
        selection.hasFormat("strikethrough"),
        eventTypes.formatStrike,
      );
      pushInEventTypesState(selection.hasFormat("code"), eventTypes.formatCode);

      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        if (!allSelectedEvents.includes(eventTypes.formatInsertLink)) {
          allSelectedEvents.push(eventTypes.formatInsertLink);
        }
        setIsLink(true);
      } else {
        if (allSelectedEvents.includes(eventTypes.formatInsertLink)) {
          allSelectedEvents = allSelectedEvents.filter(
            (ev) => ev !== eventTypes.formatCode,
          );
        }
        setIsLink(false);
      }

      setSelectedEventTypes(allSelectedEvents);
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, updateToolbar]);

  const onClick = (eventType: string) => {
    if (eventType === eventTypes.formatUndo) {
      editor.dispatchCommand(UNDO_COMMAND, void 0);
    } else if (eventType === eventTypes.formatRedo) {
      editor.dispatchCommand(REDO_COMMAND, void 0);
    } else if (eventType === eventTypes.formatBold) {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
    } else if (eventType === eventTypes.formatItalic) {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
    } else if (eventType === eventTypes.formatStrike) {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
    } else if (eventType === eventTypes.formatUnderline) {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
    } else if (eventType === eventTypes.formatAlignLeft) {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
    } else if (eventType === eventTypes.formatAlignRight) {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
    } else if (eventType === eventTypes.formatAlignCenter) {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
    } else if (eventType === eventTypes.paragraph) {
      formatParagraph();
    } else if (eventType === eventTypes.h1) {
      formatLargeHeading();
    } else if (eventType === eventTypes.h2) {
      formatSmallHeading();
    } else if (eventType === eventTypes.ul) {
      formatBulletList();
    } else if (eventType === eventTypes.ol) {
      formatNumberedList();
    } else if (eventType === eventTypes.quote) {
      formatQuote();
    } else if (eventType === eventTypes.formatCode) {
      formatCode();
    } else if (eventType === eventTypes.formatInsertLink) {
      insertLink();
    }
  };

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatLargeHeading = () => {
    if (blockType !== "h1") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h1"));
        }
      });
    }
  };

  const formatSmallHeading = () => {
    if (blockType !== "h2") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h2"));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, void 0);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, void 0);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, void 0);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, void 0);
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
      // below code insert the new block but we only need to format the specific part of the text into code format
      //   editor.update(() => {
      //     const selection = $getSelection();

      //     if ($isRangeSelection(selection)) {
      //       $wrapNodes(selection, () => $createCodeNode());
      //     }
      //   });
    }
  };

  return { modal, onClick, selectedEventTypes, blockType, isLink, editor };
};

function getSelectedNode(selection: RangeSelection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

export default useOnClickListener;
