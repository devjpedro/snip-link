"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@snip-link/ui/components/alert";
import { Button } from "@snip-link/ui/components/button";
import { Checkbox } from "@snip-link/ui/components/checkbox";
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
import { Check, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { signUp } from "@/lib/auth-client";
import { translateError } from "@/utils/translate-error";

const MIN_PASSWORD_LENGTH = 6;

const formSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.email("E-mail inválido").min(1, "E-mail é obrigatório"),
    password: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `Senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`
      ),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos de uso",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export const SignUpForm = () => {
  const [showPasswordSet, setShowPasswordSet] = useState(new Set<string>());
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const { isSubmitting } = form.formState;

  const checkVisibilityPassword = (field: string) => {
    return showPasswordSet.has(field);
  };

  const handleToggleVisibilityPassword = (field: string) => {
    setShowPasswordSet((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(field)) {
        newSet.delete(field);
      } else {
        newSet.add(field);
      }

      return newSet;
    });
  };

  const handleFormSubmit = async (data: FormData) => {
    const { name, email, password } = data;

    await signUp.email({
      email,
      password,
      name,
      callbackURL: "/dashboard",
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
        },
        onError: ({ error }) => {
          setErrorMessage(translateError(error?.code));
        },
      },
    });
  };

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(handleFormSubmit)}
      >
        {errorMessage && (
          <Alert variant="destructive">
            <AlertTitle>Erro ao fazer login</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  id="name"
                  placeholder="Seu nome"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  id="email"
                  placeholder="seu@email.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    className="pr-10"
                    disabled={isSubmitting}
                    id="password"
                    placeholder="Mínimo 6 caracteres"
                    type={
                      checkVisibilityPassword("password") ? "text" : "password"
                    }
                    {...field}
                  />
                  <Button
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    disabled={isSubmitting}
                    onClick={() => handleToggleVisibilityPassword("password")}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    {checkVisibilityPassword("password") ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirme sua senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    className="pr-10"
                    disabled={isSubmitting}
                    id="confirmPassword"
                    placeholder="Digite a senha novamente"
                    type={
                      checkVisibilityPassword("confirmPassword")
                        ? "text"
                        : "password"
                    }
                    {...field}
                  />
                  <Button
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    disabled={isSubmitting}
                    onClick={() =>
                      handleToggleVisibilityPassword("confirmPassword")
                    }
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    {checkVisibilityPassword("confirmPassword") ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value}
                    disabled={isSubmitting}
                    id="terms"
                    onCheckedChange={field.onChange}
                  />
                  <Label
                    className="gap-1 text-muted-foreground text-sm"
                    htmlFor="terms"
                  >
                    Aceito os
                    <Button
                      className="h-auto p-0 text-primary"
                      type="button"
                      variant="link"
                    >
                      termos de uso
                    </Button>
                    e
                    <Button
                      className="h-auto p-0 text-primary"
                      type="button"
                      variant="link"
                    >
                      política de privacidade
                    </Button>
                  </Label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          {isSubmitting ? "Criando conta..." : "Criar conta gratuita"}
        </Button>
      </form>
    </Form>
  );
};
