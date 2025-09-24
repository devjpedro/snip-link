"use client";

import { Button } from "@snip-link/ui/components/button";
import { Input } from "@snip-link/ui/components/input";
import { Label } from "@snip-link/ui/components/label";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { DELAY } from "@/app/constants/delay";

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!(formData.email && formData.password)) {
      setError("Todos os campos são obrigatórios");
      setIsLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, DELAY));

      // Mock authentication - in real app, this would be an API call
      if (
        formData.email === "teste@email.com" &&
        formData.password === "test123"
      ) {
        router.push("/dashboard");
      } else {
        setError("Email ou senha incorretos");
      }
    } catch {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          disabled={isLoading}
          id="email"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="seu@email.com"
          type="email"
          value={formData.email}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            className="pr-10"
            disabled={isLoading}
            id="password"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="Sua senha"
            type={showPassword ? "text" : "password"}
            value={formData.password}
          />
          <Button
            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
            disabled={isLoading}
            onClick={() => setShowPassword(!showPassword)}
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
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <Button className="w-full" disabled={isLoading} type="submit">
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>

      <div className="text-center">
        <Button className="text-muted-foreground text-sm" variant="link">
          Esqueceu sua senha?
        </Button>
      </div>

      {/* Demo credentials */}
      <div className="mt-4 rounded-lg bg-muted/50 p-3 text-muted-foreground text-xs">
        <p className="mb-1 font-medium">Credenciais de demonstração:</p>
        <p>Email: teste@email.com</p>
        <p>Senha: test123</p>
      </div>
    </form>
  );
}
