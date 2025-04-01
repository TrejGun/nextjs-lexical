"use client";

import { Grid } from "@mui/material";

import useOnClickListener from "./useOnClickListener";
import toolbarIconsList from "./toolbarIconsList";

export const LexicalEditorTopBar = () => {
  const { onClick, selectedEventTypes, blockType } = useOnClickListener();

  const isIconSelected = (event: string) =>
    selectedEventTypes.includes(event) || blockType.includes(event);

  return (
    <Grid
      container
      justifyContent="space-between"
      spacing={2}
      alignItems="center"
      sx={{ background: "white", py: 1.5, px: 0.5 }}
    >
      {toolbarIconsList.map(({ Icon, id, event }) => (
        <Grid
          key={id}
          sx={{
            cursor: "pointer",
          }}
        >
          <Icon
            onClick={() => onClick(event)}
            color={isIconSelected(event) ? "secondary" : undefined}
          />
        </Grid>
      ))}
    </Grid>
  );
};
