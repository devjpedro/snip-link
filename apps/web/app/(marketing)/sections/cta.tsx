import { Button } from "@snip-link/ui/components/button";
import type { User } from "better-auth";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { branding } from "@/app/constants/branding";

export function CTASection({ user }: { user: User | null }) {
  return (
    <section className="bg-gradient-to-br from-primary/5 via-background to-primary/5 py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 font-medium text-primary text-sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Comece agora mesmo
          </div>

          <h2 className="text-balance font-bold text-3xl md:text-5xl">
            Pronto para encurtar seus
            <span className="gradient-text block">primeiros links?</span>
          </h2>

          <p className="text-balance text-muted-foreground text-xl">
            Junte-se a milhares de desenvolvedores que já escolheram o{" "}
            <span className="rounded bg-primary/10 px-1 font-mono text-base">
              {branding.name}
            </span>
            . É gratuito, rápido e sem complicações.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            {!user && (
              <Button asChild className="px-8 text-base" size="lg">
                <Link href="/sign-up">
                  Criar Conta Gratuita
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
            {!!user && (
              <Button asChild className="px-8 text-base" size="lg">
                <Link href="/dashboard">
                  Ver Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          <p className="text-muted-foreground text-sm">
            Sem cartão de crédito • Sem limites • Sempre gratuito
          </p>
        </div>
      </div>
    </section>
  );
}
