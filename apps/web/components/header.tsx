"use client";

import { AnimatedThemeToggler } from "@snip-link/ui/components/animated-theme-toggler";
import { Button } from "@snip-link/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@snip-link/ui/components/sheet";
import { cn } from "@snip-link/ui/lib/utils";
import { LinkIcon, Menu, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { branding } from "@/app/constants/branding";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analytics", href: "/analytics" },
];

export function Header() {
  const pathName = usePathname();

  return (
    <header className="sticky top-0 z-50 border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link className="flex items-center space-x-2" href="/">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <LinkIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="gradient-text font-bold text-xl">
            {branding.name}
          </span>
        </Link>

        <nav className="hidden items-center space-x-6 lg:flex">
          {navItems.map((item) => (
            <Link
              className={cn(
                "transition-colors",
                pathName === item.href
                  ? "font-medium text-primary hover:text-primary/80"
                  : "text-muted-foreground hover:text-foreground/70"
              )}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <AnimatedThemeToggler />

          <div className="hidden items-center space-x-3 sm:flex">
            <Button asChild size="sm" variant="ghost">
              <Link href="/login">
                <User className="mr-2 h-4 w-4" />
                Entrar
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">Criar Conta</Link>
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button className="h-9 w-9 p-0" size="sm" variant="ghost">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] p-6 sm:w-[400px]" side="right">
              <nav className="mt-8 flex flex-col space-y-6">
                <Link
                  className="px-2 py-1 font-medium text-lg text-muted-foreground transition-colors hover:text-foreground"
                  href="/"
                >
                  Início
                </Link>
                <Link
                  className="px-2 py-1 font-medium text-lg text-muted-foreground transition-colors hover:text-foreground"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
                <Link
                  className="px-2 py-1 font-medium text-lg text-muted-foreground transition-colors hover:text-foreground"
                  href="/analytics"
                >
                  Analytics
                </Link>
                <div className="space-y-4 border-border border-t pt-6">
                  <Button
                    asChild
                    className="w-full justify-start"
                    size="sm"
                    variant="ghost"
                  >
                    <Link href="/login">
                      <User className="mr-2 h-4 w-4" />
                      Entrar
                    </Link>
                  </Button>
                  <Button asChild className="w-full" size="sm">
                    <Link href="/sign-up">Criar Conta</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
