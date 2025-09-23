"use client";

import { Card, CardContent } from "@snip-link/ui/components/card";
import { useEffect, useState } from "react";
import { branding } from "@/app/constants/branding";

const stats = [
  { label: "Links Encurtados", value: 50_000, suffix: "+" },
  { label: "Cliques Rastreados", value: 2_500_000, suffix: "+" },
  { label: "Desenvolvedores Ativos", value: 15_000, suffix: "+" },
  { label: "Uptime", value: 99.9, suffix: "%" },
];

export function StatsSection() {
  const [animatedValues, setAnimatedValues] = useState<number[]>(
    stats.map(() => 0)
  );

  useEffect(() => {
    const ANIMATION_STEPS = 50;
    const ANIMATION_INTERVAL_MS = 30;

    const timers = stats.map((stat, index) => {
      const increment = stat.value / ANIMATION_STEPS;
      let current = 0;

      return setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(timers[index]);
        }

        setAnimatedValues((prev) => {
          const newValues = [...prev];
          newValues[index] = current;
          return newValues;
        });
      }, ANIMATION_INTERVAL_MS);
    });

    return () => {
      for (const timer of timers) {
        clearInterval(timer);
      }
    };
  }, []);

  const formatValue = (value: number, index: number) => {
    const stat = stats[index];
    if (!stat) return Math.floor(value).toString();

    const ONE_MILLION = 1_000_000;
    const ONE_THOUSAND = 1000;

    if (stat.suffix === "%") return value.toFixed(1);

    if (value >= ONE_MILLION) return `${(value / ONE_MILLION).toFixed(1)}M`;

    if (value >= ONE_THOUSAND) return `${(value / ONE_THOUSAND).toFixed(0)}K`;

    return Math.floor(value).toString();
  };

  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-bold text-3xl">
            Confiado por milhares de developers
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Junte-se à comunidade que já escolheu o{" "}
            <span className="rounded bg-primary/10 px-1 font-mono text-base">
              {branding.name}
            </span>{" "}
            para seus projetos
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, index) => (
            <Card
              className="border-border/50 bg-card/50 text-center backdrop-blur"
              key={stat.label}
            >
              <CardContent className="p-6">
                <div className="mb-2 font-bold text-3xl text-primary">
                  {formatValue(animatedValues[index] ?? 0, index)}
                  {stat.suffix}
                </div>
                <div className="text-muted-foreground text-sm">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
