"use client";

import { Toaster } from "@snip-link/ui/components/sonner";
import { ThemeProvider } from "@snip-link/ui/components/theme-provider";
import type * as React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableColorScheme>
      {children}
      <Toaster richColors />
    </ThemeProvider>
  );
}
