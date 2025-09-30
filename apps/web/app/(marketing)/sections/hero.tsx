"use client";

import { env } from "@snip-link/env";
import { Button } from "@snip-link/ui/components/button";
import { Card, CardContent } from "@snip-link/ui/components/card";
import { Input } from "@snip-link/ui/components/input";
import type { User } from "better-auth";
import { BarChart3, LinkIcon, Shield, Zap } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { branding } from "@/app/constants/branding";
import { LONG_DELAY } from "@/app/constants/delay";
import { ResultLink } from "@/components/result-link";
import { createLinkAction } from "../actions";

export function HeroSection({ user }: { user: User | null }) {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const [isPending, startTransition] = useTransition();

  const handleShorten = () => {
    if (!url) return;

    if (!(url.startsWith("http://") || url.startsWith("https://"))) {
      toast.error("Por favor, insira uma URL válida.");
      return;
    }

    if (url.startsWith(env.NEXT_PUBLIC_API_URL)) {
      toast.error("Não é possível encurtar uma URL do próprio serviço.");
      setUrl("");
      if (shortUrl) setShortUrl("");
      return;
    }

    setShortUrl("");

    startTransition(async () => {
      const res = await createLinkAction(url, user?.id);

      if (res?.data?.existingLink) {
        setShortUrl(res.data.existingLink.shortUrl);
        toast.info(res.error);
        return;
      }

      if (!res.success) {
        toast.error(res.error || "Ocorreu um erro. Tente novamente.");
        return;
      }

      if (res.success && res.data) setShortUrl(res.data.shortUrl);

      setUrl("");
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), LONG_DELAY);
  };

  return (
    <section className="relative overflow-hidden bg-background" id="hero">
      <div className="grid-pattern absolute inset-0 opacity-50" />

      <div className="container relative mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 font-medium text-primary text-sm">
            <Zap className="mr-2 h-4 w-4" />
            Gratuito para sempre
          </div>

          <div className="space-y-4">
            <h1 className="text-balance font-bold text-4xl leading-tight md:text-6xl">
              O encurtador de links
              <span className="gradient-text block">feito para developers</span>
            </h1>
            <p className="mx-auto max-w-2xl text-balance text-muted-foreground text-xl">
              {branding.description}
            </p>
          </div>

          <Card className="mx-auto max-w-2xl border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    className="h-12 flex-1 text-base"
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Cole sua URL aqui..."
                    type="url"
                    value={url}
                  />
                  <Button
                    className="hidden h-12 px-6 sm:inline-flex sm:px-8"
                    disabled={!url || isPending}
                    onClick={handleShorten}
                    size="lg"
                  >
                    {isPending ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <>
                        <LinkIcon className="mr-0 h-4 w-4 sm:mr-2" />
                        Encurtar
                      </>
                    )}
                  </Button>
                  <Button
                    className="inline-flex h-12 px-6 sm:hidden sm:px-8"
                    disabled={!url || isPending}
                    onClick={handleShorten}
                    size="icon"
                  >
                    {isPending ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <LinkIcon className="mr-0 h-4 w-4 sm:mr-2" />
                    )}
                  </Button>
                </div>

                {shortUrl && (
                  <ResultLink
                    copied={copied}
                    handleCopy={handleCopy}
                    shortUrl={shortUrl}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 pt-8 md:grid-cols-3">
            <div className="flex items-center justify-center space-x-3 text-muted-foreground">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">100% Seguro</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-muted-foreground">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="text-sm">Analytics Detalhados</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-muted-foreground">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm">Sem Limites</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
