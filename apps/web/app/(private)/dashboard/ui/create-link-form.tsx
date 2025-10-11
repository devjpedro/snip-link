"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { env } from "@snip-link/env";
import { Button } from "@snip-link/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@snip-link/ui/components/form";
import { Input } from "@snip-link/ui/components/input";
import { Label } from "@snip-link/ui/components/label";
import { Switch } from "@snip-link/ui/components/switch";
import { LinkIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { BASE_REDIRECT_URL } from "@/app/constants/base-redirect-url";
import { ResultLink } from "@/components/result-link";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useCreateLink } from "@/hooks/use-create-link";
import { createPrivateLinkAction } from "../actions";

const MIN_ALIAS_LENGTH = 3;
const MAX_ALIAS_LENGTH = 50;

const formSchema = z.object({
  originalUrl: z
    .url("URL inválida")
    .min(1, "URL é obrigatória")
    .refine(
      (val) => val.startsWith(env.NEXT_PUBLIC_API_URL) === false,
      "Não é possível encurtar uma URL do próprio serviço"
    ),
  customAlias: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine(
      (val) => !val || val.length >= MIN_ALIAS_LENGTH,
      `Alias deve conter pelo menos ${MIN_ALIAS_LENGTH} caracteres`
    )
    .refine(
      (val) => !val || val.length <= MAX_ALIAS_LENGTH,
      `Alias deve conter no máximo ${MAX_ALIAS_LENGTH} caracteres`
    ),
  isActive: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const CreateLinkForm = () => {
  const [shortUrl, setShortUrl] = useState("");

  const { mutate: createLink } = useCreateLink({
    mutationFn: createPrivateLinkAction,
    onSuccess: (newShortUrl) => setShortUrl(newShortUrl),
  });

  const { copied, copy } = useCopyToClipboard();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originalUrl: "",
      customAlias: "",
      isActive: true,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const handleFormSubmit = async (data: FormData) => {
    const { originalUrl, customAlias, isActive } = data;

    createLink({
      originalUrl,
      customAlias,
      isActive,
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
          <FormField
            control={form.control}
            name="originalUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="originalUrl">URL Original</FormLabel>
                <FormControl>
                  <Input
                    className="h-12"
                    disabled={isSubmitting}
                    id="originalUrl"
                    placeholder="https://exemplo.com/sua-url-longa"
                    type="url"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customAlias"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="customAlias">Alias personalizado</FormLabel>
                <FormControl>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <span className="mr-2 text-muted-foreground text-sm">
                        {BASE_REDIRECT_URL}/
                      </span>

                      <Input
                        className="flex-1"
                        disabled={isSubmitting}
                        id="customAlias"
                        placeholder="meu-link-personalizado"
                        {...field}
                      />
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Deixe em branco para gerar automaticamente
                    </p>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex w-full items-center">
                  <div className="flex-1 space-y-1">
                    <Label>Status do Link</Label>
                    <p className="text-muted-foreground text-xs">
                      Links inativos não redirecionam
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value ?? true}
                      disabled={isSubmitting}
                      id="isActive"
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            className="w-full"
            disabled={isSubmitting}
            size="lg"
            type="submit"
          >
            {isSubmitting ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <LinkIcon className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? "Criando..." : "Criar Link"}
          </Button>
        </form>
      </Form>

      {shortUrl && (
        <ResultLink
          copied={copied.has(shortUrl)}
          handleCopy={() => copy(shortUrl)}
          shortUrl={shortUrl}
        />
      )}
    </div>
  );
};
