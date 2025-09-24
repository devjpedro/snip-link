"use client";

import { Button } from "@snip-link/ui/components/button";
import { Card, CardContent } from "@snip-link/ui/components/card";
import { Input } from "@snip-link/ui/components/input";
import { Label } from "@snip-link/ui/components/label";
import { Switch } from "@snip-link/ui/components/switch";
import { Textarea } from "@snip-link/ui/components/textarea";
import { AlertCircle, Check, Copy, LinkIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { DELAY, LONG_DELAY } from "@/app/constants/delay";

const BASE_36 = 36;
const SHORT_ID_LENGTH = 6;

export const CreateLinkForm = () => {
  const [formData, setFormData] = useState({
    originalUrl: "",
    customAlias: "",
    description: "",
    isActive: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.originalUrl) {
      setError("URL é obrigatória");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, DELAY));

    const shortId =
      formData.customAlias ||
      Math.random().toString(BASE_36).substr(2, SHORT_ID_LENGTH);
    setShortUrl(`devlink.sh/s/${shortId}`);
    setIsLoading(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), LONG_DELAY);
  };

  const handleReset = () => {
    setFormData({
      originalUrl: "",
      customAlias: "",
      description: "",
      isActive: true,
    });
    setShortUrl("");
    setError("");
  };

  return (
    <div className="space-y-6">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="originalUrl">URL Original *</Label>
          <Input
            className="h-12"
            id="originalUrl"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, originalUrl: e.target.value }))
            }
            placeholder="https://exemplo.com/sua-url-longa"
            type="url"
            value={formData.originalUrl}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customAlias">Alias Personalizado (opcional)</Label>
          <div className="flex items-center">
            <span className="mr-2 text-muted-foreground text-sm">
              devlink.sh/s/
            </span>
            <Input
              className="flex-1"
              id="customAlias"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customAlias: e.target.value,
                }))
              }
              placeholder="meu-link-personalizado"
              value={formData.customAlias}
            />
          </div>
          <p className="text-muted-foreground text-xs">
            Deixe em branco para gerar automaticamente
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição (opcional)</Label>
          <Textarea
            id="description"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Adicione uma descrição para organizar seus links..."
            rows={3}
            value={formData.description}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Status do Link</Label>
            <p className="text-muted-foreground text-xs">
              Links inativos não redirecionam
            </p>
          </div>
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isActive: checked }))
            }
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <Button className="w-full" disabled={isLoading} size="lg" type="submit">
          {isLoading ? (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <LinkIcon className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Criando..." : "Criar Link"}
        </Button>
      </form>

      {shortUrl && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Check className="h-5 w-5" />
                <span className="font-semibold">Link criado com sucesso!</span>
              </div>

              <div className="flex items-center gap-2 rounded-lg border bg-background p-3">
                <div className="flex-1 font-mono text-sm">{shortUrl}</div>
                <Button onClick={handleCopy} size="sm" variant="ghost">
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-transparent"
                  onClick={handleReset}
                  variant="outline"
                >
                  Criar Outro
                </Button>
                <Button className="flex-1 bg-transparent" variant="outline">
                  Ver Analytics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
