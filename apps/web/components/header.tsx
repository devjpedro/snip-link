"use client";

import { AnimatedThemeToggler } from "@snip-link/ui/components/animated-theme-toggler";
import { Button } from "@snip-link/ui/components/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@snip-link/ui/components/sheet";
import { cn } from "@snip-link/ui/lib/utils";
import type { User as UserType } from "better-auth";
import { LinkIcon, LogOut, Menu, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { branding } from "@/app/constants/branding";
import { signOut } from "@/lib/auth-client";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analytics", href: "/analytics" },
];

type HeaderProps = {
  user: UserType | null;
};

export function Header({ user }: HeaderProps) {
  const [isPending, setIsPending] = useState(false);

  const pathName = usePathname();
  const router = useRouter();

  const handleClickLogout = async () => {
    await signOut({
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onSuccess: () => {
          router.refresh();
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-[999] border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link className="flex items-center space-x-2" href="/">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <LinkIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="gradient-text font-bold text-xl">
            {branding.name}
          </span>
        </Link>

        {!!user && (
          <nav className="hidden items-center space-x-6 lg:flex">
            {navItems.map((item) => {
              return (
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
              );
            })}
          </nav>
        )}

        <div className="flex items-center space-x-3">
          <AnimatedThemeToggler />

          <div className="hidden items-center space-x-3 sm:flex">
            {!user && (
              <>
                <Button asChild size="sm" variant="ghost">
                  <Link href="/login">
                    <User className="mr-2 h-4 w-4" />
                    Entrar
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/sign-up">Criar Conta</Link>
                </Button>
              </>
            )}
            {!!user && (
              <Button
                disabled={isPending}
                onClick={handleClickLogout}
                size="sm"
              >
                Sair
              </Button>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button className="h-9 w-9 p-0" size="sm" variant="ghost">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              aria-describedby="menu-lateral"
              className="w-[300px] p-6 sm:w-[400px]"
              side="right"
            >
              <nav
                className={cn("flex flex-col space-y-6", {
                  "mt-8": !!user,
                  "mt-2": !user,
                })}
              >
                {!!user && (
                  <>
                    <SheetClose asChild>
                      <Link
                        className="px-2 py-1 font-medium text-lg text-muted-foreground transition-colors hover:text-foreground"
                        href="/"
                      >
                        Início
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link
                        className="px-2 py-1 font-medium text-lg text-muted-foreground transition-colors hover:text-foreground"
                        href="/dashboard"
                      >
                        Dashboard
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link
                        className="px-2 py-1 font-medium text-lg text-muted-foreground transition-colors hover:text-foreground"
                        href="/analytics"
                      >
                        Analytics
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Button
                        className="h-10 w-full cursor-pointer"
                        disabled={isPending}
                        onClick={handleClickLogout}
                        size="sm"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <LogOut />
                          Sair
                        </span>
                      </Button>
                    </SheetClose>
                  </>
                )}

                {!user && (
                  <div className="space-y-4 border-transparent border-t">
                    <SheetClose asChild>
                      <Button
                        asChild
                        className="h-10 w-full justify-start"
                        size="sm"
                        variant="ghost"
                      >
                        <Link href="/login">
                          <User className="mr-2 h-4 w-4" />
                          Entrar
                        </Link>
                      </Button>
                    </SheetClose>

                    <SheetClose asChild>
                      <Button asChild className="h-10 w-full" size="sm">
                        <Link href="/sign-up">Criar Conta</Link>
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
