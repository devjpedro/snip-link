import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  removeLinkAction,
  updateLinkStatusAction,
} from "@/app/(private)/dashboard/actions";
import { SHORT_DELAY } from "@/app/constants/delay";
import { api } from "@/app/http/api-client";
import type { UserLinksResponse } from "@/app/http/get-user-links";
import { useDebounce } from "@/hooks/use-debounce";

type UseLinkListParams = {
  initialData: UserLinksResponse;
};

export type LinkFilterStatus = "all" | "active" | "inactive";

const QUERY_KEY = "user-links";

export const useLinksList = ({ initialData }: UseLinkListParams) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<LinkFilterStatus>("all");

  const debouncedSearch = useDebounce(searchTerm, SHORT_DELAY);
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY, debouncedSearch, status],
    queryFn: async ({ pageParam }) => {
      const searchParams: Record<string, string | number> = {
        pageIndex: pageParam,
        searchText: debouncedSearch,
      };

      if (status !== "all") searchParams.status = status;

      return api.get("links", { searchParams }).json<UserLinksResponse>();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.meta.nextPageIndex,
    placeholderData: (previousData) => previousData,
    ...(debouncedSearch === "" && status === "all"
      ? {
          initialData: {
            pages: [initialData],
            pageParams: [0],
          },
        }
      : {}),
  });

  const links = data?.pages.flatMap((page) => page.links);

  const { mutate: deleteLink } = useMutation({
    mutationFn: (linkId: string) => removeLinkAction(linkId),
    onMutate: async (linkId: string) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });

      const previousData = queryClient.getQueryData([
        QUERY_KEY,
        debouncedSearch,
        status,
      ]);

      queryClient.setQueryData<typeof data>(
        [QUERY_KEY, debouncedSearch, status],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              links: page.links.filter((link) => link.id !== linkId),
            })),
          };
        }
      );

      toast.success("Link excluído com sucesso!");

      return { previousData };
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          [QUERY_KEY, debouncedSearch, status],
          context.previousData
        );
      }

      toast.error("Ocorreu um erro ao excluir o link.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  const { mutate: updateLinkStatus } = useMutation({
    mutationFn: ({ linkId, isActive }: { linkId: string; isActive: boolean }) =>
      updateLinkStatusAction(linkId, isActive),
    onMutate: async ({ linkId, isActive }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });

      const previousData = queryClient.getQueryData([
        QUERY_KEY,
        debouncedSearch,
        status,
      ]);

      queryClient.setQueryData<typeof data>(
        [QUERY_KEY, debouncedSearch, status],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              links: page.links.map((link) =>
                link.id === linkId ? { ...link, isActive } : link
              ),
            })),
          };
        }
      );

      toast.success("Status atualizado com sucesso!");

      return { previousData };
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["links", debouncedSearch],
          context.previousData
        );
      }

      toast.error("Ocorreu um erro ao atualizar o status.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  const handleClickDelete = useCallback(
    (linkId: string) => {
      deleteLink(linkId);
    },
    [deleteLink]
  );

  const handleClickUpdateStatus = useCallback(
    (linkId: string, isActive: boolean) => {
      updateLinkStatus({ linkId, isActive });
    },
    [updateLinkStatus]
  );

  return {
    links,
    searchTerm,
    status,

    setStatus,
    setSearchTerm,

    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isRefetching,

    handleClickDelete,
    handleClickUpdateStatus,
  };
};
