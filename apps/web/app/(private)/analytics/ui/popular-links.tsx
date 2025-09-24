"use client";

import { Badge } from "@snip-link/ui/components/badge";
import { Button } from "@snip-link/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@snip-link/ui/components/card";
import { BarChart3, Copy, ExternalLink } from "lucide-react";

const popularLinks = [
  {
    id: "1",
    shortId: "projeto-github",
    originalUrl: "https://github.com/usuario/projeto-incrivel",
    clicks: 156,
    isActive: true,
  },
  {
    id: "2",
    shortId: "artigo-dev",
    originalUrl: "https://blog.exemplo.com/artigo-sobre-desenvolvimento",
    clicks: 89,
    isActive: false,
  },
  {
    id: "3",
    shortId: "xyz789",
    originalUrl: "https://docs.exemplo.com/api/documentacao-completa",
    clicks: 67,
    isActive: true,
  },
];

export const PopularLinks = () => {
  const handleCopy = async (shortId: string) => {
    await navigator.clipboard.writeText(`devlink.sh/s/${shortId}`);
  };

  const truncateUrl = (url: string, maxLength = 50) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Links Mais Populares
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {popularLinks.map((link, index) => (
            <div
              className="flex items-center justify-between rounded-lg bg-muted/30 p-4"
              key={link.id}
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-primary">
                      devlink.sh/s/{link.shortId}
                    </span>
                    <Badge
                      className="text-xs"
                      variant={link.isActive ? "default" : "secondary"}
                    >
                      {link.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <ExternalLink className="h-3 w-3" />
                    <span className="truncate">
                      {truncateUrl(link.originalUrl)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-semibold">{link.clicks}</div>
                  <div className="text-muted-foreground text-xs">cliques</div>
                </div>

                <Button
                  onClick={() => handleCopy(link.shortId)}
                  size="sm"
                  variant="ghost"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
