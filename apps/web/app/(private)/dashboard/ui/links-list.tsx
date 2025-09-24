"use client";

import { Badge } from "@snip-link/ui/components/badge";
import { Button } from "@snip-link/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@snip-link/ui/components/dropdown-menu";
import { Input } from "@snip-link/ui/components/input";
import { MagicCard } from "@snip-link/ui/components/magic-card";
import {
  BarChart3,
  Calendar,
  Check,
  Copy,
  Edit,
  ExternalLink,
  MoreHorizontal,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";

// Mock data
const mockLinks = [
  {
    id: "1",
    shortId: "abc123",
    originalUrl: "https://github.com/usuario/projeto-incrivel",
    customAlias: "projeto-github",
    clicks: 156,
    isActive: true,
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "2",
    shortId: "xyz789",
    originalUrl: "https://docs.exemplo.com/api/documentacao-completa",
    customAlias: null,
    clicks: 89,
    isActive: true,
    createdAt: "2025-01-14T15:45:00Z",
  },
  {
    id: "3",
    shortId: "def456",
    originalUrl: "https://blog.exemplo.com/artigo-sobre-desenvolvimento",
    customAlias: "artigo-dev",
    clicks: 234,
    isActive: false,
    createdAt: "2025-01-12T09:15:00Z",
  },
];

const COPY_NOTIFICATION_DURATION_MS = 2000;

export const LinksList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLinks = mockLinks.filter(
    (link) =>
      link.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.customAlias?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = async (shortUrl: string, id: string) => {
    await navigator.clipboard.writeText(`devlink.sh/s/${shortUrl}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), COPY_NOTIFICATION_DURATION_MS);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const truncateUrl = (url: string, maxLength = 50) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
        <Input
          className="pl-10"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar links..."
          value={searchTerm}
        />
      </div>

      <div className="space-y-4">
        {filteredLinks.length === 0 ? (
          <MagicCard className="p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">
                Nenhum link encontrado
              </h3>
              <p className="text-center text-muted-foreground">
                {searchTerm
                  ? "Tente ajustar sua busca"
                  : "Você ainda não criou nenhum link"}
              </p>
            </div>
          </MagicCard>
        ) : (
          filteredLinks.map((link) => (
            <MagicCard className="p-6" key={link.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="font-mono font-semibold text-lg text-primary">
                      devlink.sh/s/{link.customAlias || link.shortId}
                    </div>
                    <Badge variant={link.isActive ? "default" : "secondary"}>
                      {link.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ExternalLink className="h-4 w-4 shrink-0" />
                    <span className="truncate" title={link.originalUrl}>
                      {truncateUrl(link.originalUrl)}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-muted-foreground text-sm">
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      <span>{link.clicks} cliques</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(link.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() =>
                      handleCopy(link.customAlias || link.shortId, link.id)
                    }
                    size="sm"
                    variant="outline"
                  >
                    {copiedId === link.id ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Ver Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </MagicCard>
          ))
        )}
      </div>
    </div>
  );
};
