"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Theme behaviour:
 * - First visit: `defaultTheme="system"` + `enableSystem` follow the device preference
 *   (and keep following it until the visitor chooses).
 * - The UI only ever offers Light and Dark; "system" is an invisible initial state.
 * - An explicit choice is persisted by next-themes in localStorage.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="pathway-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
