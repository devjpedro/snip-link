# 🚀 Guia de Deploy - Railway + Vercel

Este guia contém instruções detalhadas para fazer deploy do **Snip Link** com diferentes estratégias de hospedagem.

## 📋 Pré-requisitos

- [ ] Conta no [Railway](https://railway.app)
- [ ] Conta na [Vercel](https://vercel.com) (opcional)
- [ ] Repositório Git (GitHub, GitLab ou Bitbucket)
- [ ] Banco de dados PostgreSQL (Neon ou Railway)
- [ ] URL do banco de dados em mãos
- [ ] Domínio customizado (necessário para Railway + Vercel)

---

## 🎯 Escolha Sua Estratégia

### **Estratégia 1: Tudo no Railway (RECOMENDADO - GRATUITO)** ✅

**Vantagens:**

- ✅ Configuração mais simples
- ✅ Sem problemas de cookies cross-domain
- ✅ Não precisa de domínio customizado
- ✅ Um único domínio para gerenciar

**Desvantagens:**

- ⚠️ Usa recursos de um único serviço Railway

**Use quando:** Você não tem domínio customizado ou quer simplicidade máxima.

[👉 Ir para Estratégia 1](#estratégia-1-tudo-no-railway)

# Estratégia 1: Tudo no Railway

## 🔧 Passo 1: Preparar o Projeto

### 1.1 Criar arquivo `railway.json` na raiz

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 1.2 Criar arquivo `nixpacks.toml` na raiz

```toml
[phases.setup]
nixPkgs = ["bun"]

[phases.install]
cmds = ["bun install"]

[phases.build]
cmds = [
  "cd apps/api && bun run db:generate",
  "bun run build"
]

[start]
cmd = "bun run start:railway"
```

### 1.3 Criar script de inicialização

Crie o arquivo `apps/api/start.sh`:

```bash
#!/bin/bash
set -e

echo "🔄 Aguardando banco de dados..."
sleep 5

echo "🔄 Rodando migrations..."
bun run db:migrate || {
  echo "⚠️ Migrations falharam, tentando novamente..."
  sleep 5
  bun run db:migrate
}

echo "✅ Migrations concluídas!"
echo "🚀 Iniciando servidor..."
bun run src/http/server.ts
```

Torne o script executável:

```bash
chmod +x apps/api/start.sh
git add apps/api/start.sh
git commit -m "chore: add start script"
```

### 1.4 Atualizar `apps/api/package.json`

```json
{
  "scripts": {
    "start": "./start.sh",
    "db:migrate": "drizzle-kit migrate",
    "db:generate": "drizzle-kit generate"
  }
}
```

### 1.5 Instalar dependência no projeto raiz

```bash
bun add -D concurrently
```

### 1.6 Adicionar script no `package.json` raiz

```json
{
  "scripts": {
    "start:railway": "concurrently \"cd apps/api && bun run start\" \"cd apps/web && bun run start\""
  }
}
```

### 1.7 Configurar Next.js para proxy interno

Atualize `apps/web/next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: "http://localhost:3333/auth/:path*",
      },
      {
        source: "/api/:path*",
        destination: "http://localhost:3333/api/:path*",
      },
      {
        source: "/r/:path*",
        destination: "http://localhost:3333/r/:path*",
      },
    ];
  },
};

export default nextConfig;
```

---

## 🔐 Passo 2: Configurar Autenticação

### 2.1 Atualizar `apps/api/src/http/lib/auth.ts`

```typescript
import { env } from "@snip-link/env";
import bcrypt from "bcrypt";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { db } from "../../db/client";

const MAX_AGE = 7;
const isProduction = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  basePath: "/auth",
  trustedOrigins: [env.NEXT_PUBLIC_BASE_URL],
  plugins: [openAPI()],
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  advanced: {
    database: {
      generateId: false,
    },
    cookiePrefix: "snip-link",
    useSecureCookies: isProduction,
    crossSubDomainCookies: {
      enabled: false, // ✅ Mesmo domínio
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
    password: {
      hash: async (password: string) => bcrypt.hash(password, 10),
      verify: async ({ password, hash }) => bcrypt.compare(password, hash),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * MAX_AGE,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * MAX_AGE,
    },
  },
});
```

### 2.2 Configurar CORS

```typescript
import cors from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import { env } from "@snip-link/env";
import Elysia from "elysia";
import { betterAuthPlugin, OpenAPI } from "./plugins/better-auth";
import { analyticsRoutes } from "./routes/analytics";
import { linksRoutes } from "./routes/links";
import { redirectToUrl } from "./routes/redirect-to-url";

const isProduction = process.env.NODE_ENV === "production";

const app = new Elysia()
  .use(
    cors({
      origin: (request) => {
        const origin = request.headers.get("origin");

        if (isProduction) {
          // Permite o próprio domínio (proxy interno do Next.js)
          return origin?.endsWith(".up.railway.app") ?? false;
        }

        return origin?.includes("localhost") ?? false;
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
      exposedHeaders: ["Set-Cookie"],
    })
  )
  .use(betterAuthPlugin)
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
        info: {
          title: "SnipLink API",
          version: "1.0.0",
          description: "Documentação oficial da API do SnipLink",
        },
      },
    })
  )
  .use(linksRoutes)
  .use(redirectToUrl)
  .use(analyticsRoutes)
  .get("/health", () => "OK")
  .listen({
    port: env.PORT,
    hostname: "0.0.0.0",
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
```

### 2.3 Atualizar Middleware

```typescript
import { env } from "@snip-link/env";
import { getCookieCache } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/sign-up"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const session = await getCookieCache(request, {
    secret: env.BETTER_AUTH_SECRET,
    isSecure: process.env.NODE_ENV === "production",
    cookiePrefix: "snip-link",
  });

  const isPublicPath = PUBLIC_PATHS.includes(path);
  const isAuthPath = path === "/login" || path === "/sign-up";

  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && isAuthPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const response = NextResponse.next();

  if (process.env.NODE_ENV === "production") {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/sign-up",
    "/dashboard/:path*",
    "/analytics/:path*",
  ],
};
```

---

## 🚂 Passo 3: Deploy no Railway

### 3.1 Criar Projeto

1. Acesse [railway.app](https://railway.app)
2. Clique em **"New Project"**
3. Escolha **"Deploy from GitHub repo"**
4. Selecione `snip-link`

### 3.2 Configurar Variáveis

```env
NODE_ENV=production
DATABASE_URL=sua-url-do-postgresql
BETTER_AUTH_SECRET=chave-com-32-caracteres-gerada-com-openssl
BETTER_AUTH_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_BASE_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_API_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
PORT=3000
```

### 3.3 Configurar Build

**Settings → Build:**

- Build Command: `bun install && bun run build`
- Start Command: `bun run start:railway`
- Root Directory: _(vazio)_

### 3.4 Deploy

Clique em **"Deploy"** e aguarde 3-5 minutos.

---
