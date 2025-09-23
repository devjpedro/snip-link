"use client";

import { Button } from "@snip-link/ui/components/button";
import { Card, CardContent } from "@snip-link/ui/components/card";
import { Input } from "@snip-link/ui/components/input";
import { BarChart3, Check, Copy, LinkIcon, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { DELAY, LONG_DELAY } from "@/app/constants/delay";

const SHORT_URL_BASE = "snip.link/s";
const RANDOM_ID_RADIX = 36;
const RANDOM_ID_LENGTH = 6;

export function HeroSection() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShorten = async () => {
    if (!url) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, DELAY));
      setShortUrl(
        `${SHORT_URL_BASE}/${Math.random()
          .toString(RANDOM_ID_RADIX)
          .slice(2, 2 + RANDOM_ID_LENGTH)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), LONG_DELAY);
  };

  return (
    <section className="relative overflow-hidden bg-background">
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
              Transforme URLs longas em links curtos e elegantes. Com analytics
              detalhados e sem limites de uso.
            </p>
          </div>

          <Card className="mx-auto max-w-2xl border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="p-6">
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
                    className="h-12 px-8"
                    disabled={!url || isLoading}
                    onClick={handleShorten}
                    size="lg"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Encurtar
                      </>
                    )}
                  </Button>
                </div>

                {shortUrl && (
                  <div className="flex animate-fade-in-up items-center gap-2 rounded-lg border bg-muted/50 p-3">
                    <div className="flex-1 font-mono text-foreground text-sm">
                      {shortUrl}
                    </div>
                    <Button
                      className="shrink-0"
                      onClick={handleCopy}
                      size="sm"
                      variant="ghost"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
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
