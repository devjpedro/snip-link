import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CreateLinkFn<Payload, Result> = (payload: Payload) => Promise<Result>;

type UseCreateLinkOptions<Payload, Result> = {
  mutationFn: CreateLinkFn<Payload, Result>;
  queryKey?: string[];
  onSuccess?: (shortUrl: string) => void;
};

export function useCreateLink<Payload, Result>({
  mutationFn,
  queryKey = ["user-links"],
  onSuccess,
}: UseCreateLinkOptions<Payload, Result>) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn,

    // biome-ignore lint/suspicious/noExplicitAny: < Necessary any>
    onSuccess: (res: any) => {
      if (res?.data?.existingLink) {
        toast.info(res.error);
        onSuccess?.(res.data.existingLink.shortUrl);
        return;
      }

      if (!res.success) {
        toast.error(res.error || "Ocorreu um erro. Tente novamente.");
        return;
      }

      if (res.success && res.data) {
        toast.success("Link criado com sucesso!");
        onSuccess?.(res.data.shortUrl);
      }

      queryClient.invalidateQueries({ queryKey });
    },

    onError: () => {
      toast.error("Ocorreu um erro ao criar o link.");
    },
  });

  return {
    mutate,
    isPending,
  };
}
