import { Geist, Geist_Mono } from "next/font/google";

import "@snip-link/ui/globals.css";
import { auth } from "@snip-link/api/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "snip.link",
  description: "Um encurtador de URLs simples e eficiente.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <Header user={session?.user ?? null} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
