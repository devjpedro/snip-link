/** biome-ignore-all lint/suspicious/noArrayIndexKey: <Necessary> */
import { Badge } from "@snip-link/ui/components/badge";
import { Button } from "@snip-link/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@snip-link/ui/components/dropdown-menu";
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
import { memo } from "react";
import { BASE_REDIRECT_URL } from "@/app/constants/base-redirect-url";
import type { UserLinks } from "@/app/http/get-user-links";
import { ListSkeleton } from "@/components/skeletons/list-skeleton";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { formatDate } from "@/utils/format-date";
import { truncateUrl } from "@/utils/truncate-url";
import { InfiniteScrollContainer } from "./infinite-scroll-container";

type LinksListProps = {
  links: UserLinks[] | undefined;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isFetching: boolean;
  fetchNextPage: () => void;
  onDeleteLink: (linkId: string) => void;
  onUpdateLinkStatus: (linkId: string, isActive: boolean) => void;
};

function LinksListComponent({
  links,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isFetching,
  onDeleteLink,
  onUpdateLinkStatus,
}: LinksListProps) {
  const { copied, copy } = useCopyToClipboard(BASE_REDIRECT_URL);

  if (isFetching && !isFetchingNextPage && !isFetchingNextPage && !links)
    return (
      <>
        {Array.from({ length: 3 }).map((_, index) => (
          <ListSkeleton key={`skeleton-${index}`} />
        ))}
      </>
    );

  return (
    <>
      {links && links.length > 0 ? (
        <InfiniteScrollContainer
          className="space-y-3"
          onBottom={() => hasNextPage && !isFetching && fetchNextPage()}
        >
          <div className="space-y-4">
            {links.map((link) => (
              <MagicCard className="p-6" key={link.id}>
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
                  <div className="order-1 min-w-0 max-w-fill flex-1 space-y-3 md:order-0">
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                      <a
                        className="order-1 max-w-full truncate font-mono font-semibold text-lg text-primary hover:underline sm:order-0"
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
                      onClick={() => copy(link.shortId, link.id)}
                      size="sm"
                      variant="outline"
                    >
                      {copied.has(link.id) ? (
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
                        <DropdownMenuItem
                          onClick={() =>
                            onUpdateLinkStatus(link.id, !link.isActive)
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {link.isActive ? "Desativar" : "Ativar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDeleteLink(link.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </MagicCard>
            ))}
          </div>
          {isFetchingNextPage && (
            <div className="mt-4 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <ListSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          )}
        </InfiniteScrollContainer>
      ) : (
        <MagicCard className="p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-semibold text-lg">
              Nenhum link encontrado
            </h3>
            <p className="text-center text-muted-foreground">
              Tente ajustar seus filtros ou criar um novo link
            </p>
          </div>
        </MagicCard>
      )}
    </>
  );
}

export const LinksList = memo(LinksListComponent);
