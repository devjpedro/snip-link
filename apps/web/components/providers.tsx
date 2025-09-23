"use client";

import { ThemeProvider } from "@snip-link/ui/components/theme-provider";
import type * as React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableColorScheme>
      {children}
    </ThemeProvider>
  );
}
