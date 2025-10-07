"use client";

import { Button } from "@snip-link/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@snip-link/ui/components/card";
import { Check, Copy, ExternalLink } from "lucide-react";
import { BASE_REDIRECT_URL } from "@/app/constants/base-redirect-url";
import type { PopularLink } from "@/app/types/user-stats";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export const PopularLinks = ({ links }: { links: PopularLink[] }) => {
  const { copied, copy } = useCopyToClipboard(BASE_REDIRECT_URL);

  const truncateUrl = (url: string, maxLength = 50) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Links ativos mais populares
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {links?.map((link, index) => (
            <div
              className="flex flex-col items-start justify-between gap-3 rounded-lg bg-muted/30 p-2 sm:flex-row sm:items-center sm:gap-2 sm:p-4"
              key={link.id}
            >
              <div className="flex min-w-0 max-w-fill flex-1 items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <a
                      className="max-w-full truncate font-mono font-semibold text-primary hover:underline"
                      href={`${BASE_REDIRECT_URL}/${link.customAlias || link.shortId}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {BASE_REDIRECT_URL}/{link.customAlias || link.shortId}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <ExternalLink className="h-3 w-3" />
                    <span className="truncate">
                      {truncateUrl(link.originalUrl)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="flex flex-row items-center gap-1 text-right sm:flex-col sm:items-end sm:gap-0">
                  <div className="font-semibold">{link.clicks}</div>
                  <div className="text-muted-foreground text-xs">cliques</div>
                </div>

                <Button
                  onClick={() => copy(link.shortId, link.id)}
                  size="sm"
                  variant="ghost"
                >
                  {copied.has(link.id) ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
