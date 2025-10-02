/** biome-ignore-all lint/style/noMagicNumbers: <Necessary> */
"use client";

import { Toaster } from "@snip-link/ui/components/sonner";
import { ThemeProvider } from "@snip-link/ui/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type * as React from "react";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutos
            retry: 1,
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableColorScheme>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* <ReactQueryDevtools initialIsOpen={false}  /> */}
      </QueryClientProvider>
      <Toaster richColors />
    </ThemeProvider>
  );
}
