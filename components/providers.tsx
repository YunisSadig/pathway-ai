"use client";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "motion/react";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      // Atomic palettes avoid temporarily mixing low-contrast foregrounds and
      // backgrounds. The theme control animates independently with keyframes.
      disableTransitionOnChange
    >
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  );
}
