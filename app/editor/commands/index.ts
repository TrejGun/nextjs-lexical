import { createCommand } from "lexical";

export interface IInsertVideoPayload {
  url: string;
}

export const INSERT_VIDEO_COMMAND = createCommand<IInsertVideoPayload>(
  "INSERT_VIDEO_COMMAND",
);
