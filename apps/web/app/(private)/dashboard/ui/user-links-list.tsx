"use client";

import { Input } from "@snip-link/ui/components/input";
import { Loader2, Search } from "lucide-react";
import type { UserLinksResponse } from "@/app/http/get-user-links";
import { LinksList } from "@/components/links-listing";
import { useLinksList } from "@/hooks/use-links-list";

type LinksListProps = {
  initialData: UserLinksResponse;
};

export const UserLinksList = ({ initialData }: LinksListProps) => {
  const {
    searchTerm,
    setSearchTerm,
    links,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isRefetching,
    handleClickDelete,
    handleClickUpdateStatus,
  } = useLinksList({ initialData });

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
        {isRefetching && !isFetchingNextPage && (
          <Loader2 className="-translate-y-1/2 absolute top-1/2 right-3 h-4 w-4 animate-spin text-primary" />
        )}
      </div>

      <LinksList
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetching={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        links={links}
        onDeleteLink={handleClickDelete}
        onUpdateLinkStatus={handleClickUpdateStatus}
      />
    </div>
  );
};
