"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { LONG_DELAY } from "@/app/constants/delay";

const formSchema = z.object({
  email: z.email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type FormData = z.infer<typeof formSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const handleFormSubmit = async (data: FormData) => {
    // biome-ignore lint/suspicious/noConsole: <Necessary>
    console.log({ data });

    await new Promise((resolve) => setTimeout(resolve, LONG_DELAY));

    router.push("/dashboard");
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
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
                    placeholder="Digite sua senha"
                    type={showPassword ? "text" : "password"}
                    {...field}
                  />
                  <Button
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    disabled={isSubmitting}
                    onClick={() => setShowPassword((prev) => !prev)}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    {showPassword ? (
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

        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : null}
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>

        <div className="text-center">
          <Button className="text-muted-foreground text-sm" variant="link">
            Esqueceu sua senha?
          </Button>
        </div>
      </form>
    </Form>
  );
}
