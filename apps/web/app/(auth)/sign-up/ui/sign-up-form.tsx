"use client";

import { Button } from "@snip-link/ui/components/button";
import { Checkbox } from "@snip-link/ui/components/checkbox";
import { Input } from "@snip-link/ui/components/input";
import { Label } from "@snip-link/ui/components/label";
import { AlertCircle, Check, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { LONG_DELAY } from "@/app/constants/delay";

const MIN_PASSWORD_LENGTH = 6;

export const SignUpForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (
      !(
        formData.name &&
        formData.email &&
        formData.password &&
        formData.confirmPassword
      )
    ) {
      setError("Todos os campos são obrigatórios");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < MIN_PASSWORD_LENGTH) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError("Você deve aceitar os termos de uso");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, LONG_DELAY));
      router.push("/dashboard");
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input
          disabled={isLoading}
          id="name"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Seu nome"
          type="text"
          value={formData.name}
        />
      </div>

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
            placeholder="Mínimo 6 caracteres"
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <div className="relative">
          <Input
            className="pr-10"
            disabled={isLoading}
            id="confirmPassword"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            placeholder="Digite a senha novamente"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
          />
          <Button
            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
            disabled={isLoading}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            size="sm"
            type="button"
            variant="ghost"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={formData.acceptTerms}
          disabled={isLoading}
          id="terms"
          onCheckedChange={(checked) =>
            setFormData((prev) => ({
              ...prev,
              acceptTerms: checked as boolean,
            }))
          }
        />
        <Label className="text-muted-foreground text-sm" htmlFor="terms">
          Aceito os{" "}
          <Button className="h-auto p-0 text-primary" variant="link">
            termos de uso
          </Button>{" "}
          e{" "}
          <Button className="h-auto p-0 text-primary" variant="link">
            política de privacidade
          </Button>
        </Label>
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
        ) : (
          <Check className="mr-2 h-4 w-4" />
        )}
        {isLoading ? "Criando conta..." : "Criar conta gratuita"}
      </Button>
    </form>
  );
};
