import { env } from "@snip-link/env";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@snip-link/ui/components/card";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignUpForm } from "./ui/sign-up-form";

export default function SignUpPage() {
  // Em modo "google" não há cadastro por formulário — o 1º login com Google cria a conta.
  if (env.NEXT_PUBLIC_AUTH_MODE === "google") {
    redirect("/login");
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Criar conta gratuita</CardTitle>
            <p className="text-muted-foreground">
              Comece a encurtar seus links em segundos
            </p>
          </CardHeader>
          <CardContent>
            <SignUpForm />
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link className="text-primary hover:underline" href="/login">
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
