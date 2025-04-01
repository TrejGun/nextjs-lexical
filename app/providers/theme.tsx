import { FC, PropsWithChildren } from "react";
import {
  createTheme,
  CssBaseline,
  PaletteOptions,
  StyledEngineProvider,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

export interface IThemeProviderProps {
  darkPalette?: PaletteOptions;
  lightPalette?: PaletteOptions;
  options?: Omit<ThemeOptions, "palette">;
}

export const ThemeProvider: FC<PropsWithChildren<IThemeProviderProps>> = (
  props,
) => {
  const { options = {}, children } = props;

  const cache = createCache({
    key: "muiltr",
    prepend: true,
  });

  const theme = createTheme({
    colorSchemes: { light: true, dark: true },
    ...options,
  });

  return (
    <CacheProvider value={cache}>
      <StyledEngineProvider injectFirst>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  );
};
