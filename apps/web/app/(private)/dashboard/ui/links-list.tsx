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
import { toast } from "sonner";
import { BASE_REDIRECT_URL } from "@/app/constants/base-redirect-url";
import { LONG_DELAY } from "@/app/constants/delay";
import type { UserLinks } from "@/app/http/get-user-links";
import { removeLinkAction, updateLinkStatusAction } from "../actions";

type LinksListProps = {
  links: UserLinks[];
};

export const LinksList = ({ links }: LinksListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (shortUrl: string, id: string) => {
    await navigator.clipboard.writeText(`${BASE_REDIRECT_URL}/${shortUrl}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), LONG_DELAY);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    return dateObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const truncateUrl = (url: string, maxLength = 50) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  // biome-ignore lint/suspicious/useAwait: <Necessary>
  const handleClickDelete = async (linkId: string) => {
    toast.promise(removeLinkAction(linkId), {
      loading: "Excluindo link...",
      success: (response) => response.message || "Link excluído com sucesso!",
      error: () => "Ocorreu um erro ao excluir o link.",
    });
  };

  const handleClickUpdateStatus = (linkId: string, isActive: boolean) => {
    toast.promise(updateLinkStatusAction(linkId, isActive), {
      loading: "Atualizando status...",
      success: (response) =>
        response.message || "Status atualizado com sucesso!",
      error: () => "Ocorreu um erro ao atualizar o status.",
    });
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
        {links.length === 0 ? (
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
          links.map((link) => (
            <MagicCard className="p-6" key={link.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <a
                      className="font-mono font-semibold text-lg text-primary hover:underline"
                      href={`${BASE_REDIRECT_URL}/${link.customAlias || link.shortId}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {BASE_REDIRECT_URL}/{link.customAlias || link.shortId}
                    </a>
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
                      <span>{link.clickCount} cliques</span>
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
                      {/* <DropdownMenuItem>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Ver Analytics
                      </DropdownMenuItem> */}
                      <DropdownMenuItem
                        onClick={() =>
                          handleClickUpdateStatus(link.id, !link.isActive)
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {link.isActive ? "Desativar" : "Ativar"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleClickDelete(link.id)}
                      >
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
