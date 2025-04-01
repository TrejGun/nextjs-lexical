"use client";

import { Grid, Typography } from "@mui/material";

import { LexicalEditorWrapper } from "./components/LexicalEditorWrapper";

export const Editor = () => {
  return (
    <Grid
      container
      sx={{ minHeight: "100vh" }}
      flexDirection="column"
      alignItems="center"
    >
      <Grid sx={{ my: 4 }}>
        <Typography variant="h4">Lexical Editor</Typography>
      </Grid>
      <Grid sx={{ width: 750, overflow: "hidden" }}>
        <LexicalEditorWrapper />
      </Grid>
    </Grid>
  );
};
