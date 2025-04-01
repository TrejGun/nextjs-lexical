"use client";

import { PropsWithChildren } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import { ThemeProvider } from "./theme";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AppRouterCacheProvider>
  );
}
