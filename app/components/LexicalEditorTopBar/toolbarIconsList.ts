"use client";

import {
  CloudCircleOutlined,
  CloudDone,
  Code,
  FormatAlignJustifyOutlined,
  FormatAlignLeftOutlined,
  FormatAlignRightOutlined,
  FormatBoldOutlined,
  FormatItalicOutlined,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatUnderlinedOutlined,
  RedoOutlined,
  StrikethroughSOutlined,
  TextFields,
  UndoOutlined,
} from "@mui/icons-material";

export const eventTypes = {
  paragraph: "paragraph",
  h1: "h1",
  h2: "h2",
  ul: "ul",
  ol: "ol",
  quote: "quote",
  formatCode: "formatCode",
  formatUndo: "formatUndo",
  formatRedo: "formatRedo",
  formatBold: "formatBold",
  formatItalic: "formatItalic",
  formatUnderline: "formatUnderline",
  formatStrike: "formatStrike",
  formatInsertLink: "formatInsertLink",
  formatAlignLeft: "formatAlignLeft",
  formatAlignCenter: "formatAlignCenter",
  formatAlignRight: "formatAlignRight",
  insertImage: "insertImage",
};

const pluginsList = [
  {
    id: 1,
    Icon: TextFields,
    event: eventTypes.paragraph,
  },
  {
    id: 2,
    Icon: CloudCircleOutlined,
    event: eventTypes.h1,
  },
  {
    id: 3,
    Icon: CloudDone,
    event: eventTypes.h2,
  },
  {
    id: 4,
    Icon: FormatListBulleted,
    event: eventTypes.ul,
  },
  {
    id: 5,
    Icon: FormatListNumbered,
    event: eventTypes.ol,
  },
  {
    id: 6,
    Icon: FormatQuote,
    event: eventTypes.quote,
  },

  {
    id: 7,
    Icon: Code,
    event: eventTypes.formatCode,
  },
  {
    id: 8,
    Icon: UndoOutlined,
    event: eventTypes.formatUndo,
  },
  {
    id: 9,
    Icon: RedoOutlined,
    event: eventTypes.formatRedo,
  },
  {
    id: 10,
    Icon: FormatBoldOutlined,
    event: eventTypes.formatBold,
  },
  {
    id: 11,
    Icon: FormatItalicOutlined,
    event: eventTypes.formatItalic,
  },
  {
    id: 12,
    Icon: FormatUnderlinedOutlined,
    event: eventTypes.formatUnderline,
  },
  {
    id: 13,
    Icon: StrikethroughSOutlined,
    event: eventTypes.formatStrike,
  },
  // {
  //   id: 14,
  //   Icon: InsertLinkOutlined,
  //   event: eventTypes.formatInsertLink,
  // },
  {
    id: 15,
    Icon: FormatAlignLeftOutlined,
    event: eventTypes.formatAlignLeft,
  },

  {
    id: 16,
    Icon: FormatAlignJustifyOutlined,
    event: eventTypes.formatAlignCenter,
  },
  {
    id: 17,
    Icon: FormatAlignRightOutlined,
    event: eventTypes.formatAlignRight,
  },
];

export default pluginsList;
