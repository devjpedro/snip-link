import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@snip-link/ui/components/card";
import Link from "next/link";
import { LoginForm } from "./ui/login-form";

export default function LoginPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Entrar na sua conta</CardTitle>
            <p className="text-muted-foreground">
              Acesse seu dashboard e gerencie seus links
            </p>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Não tem uma conta? </span>
              <Link className="text-primary hover:underline" href="/sign-up">
                Criar conta gratuita
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
