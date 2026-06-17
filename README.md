<div align="center">

# Snip Link 🔗

**Encurtador de links moderno e minimalista — cada clique medido em tempo real.**

Crie links curtos com alias personalizado ou automático, ative/desative, acompanhe o histórico
de cliques e visualize tudo num dashboard com analytics em tempo real.

![Bun](https://img.shields.io/badge/Bun-1.2-black?logo=bun)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Elysia](https://img.shields.io/badge/Elysia-API-blueviolet)

🔗 **[sniplinkjp.vercel.app](https://sniplinkjp.vercel.app)**

![App Screenshot](https://jam.dev/cdn-cgi/image/width=1600,quality=100,dpr=1/https://cdn-jam-screenshots.jam.dev/d76bd5b4498d4552fabf57f3f57c8d08/screenshot/49ed874c-7e30-4d1e-8438-5893e29ddc01.png)

</div>

> O objetivo deste projeto foi treinar minhas habilidades com **Next.js** e colocar em prática
> novos conhecimentos em criação de API com **Elysia**, num monorepo escalável com autenticação
> robusta, analytics em tempo real e interface elegante.

---

## Funcionalidades

- **Autenticação** completa com Better Auth — e-mail/senha (dev) ou Google (prod), sessões seguras e proteção de rotas no front e no back.
- **Gestão de links**: criação com alias personalizado ou automático, listagem com infinite scroll, ativação/desativação e exclusão.
- **Redirecionamento** dos links curtos servido no próprio domínio do front, contabilizando cada clique.
- **Analytics em tempo real**: dashboard com total de cliques, links criados e gráfico de cliques ao longo do tempo (Recharts).
- **Interface moderna**: design responsivo e acessível, tema claro/escuro, animações com Framer Motion e toasts com Sonner.
- **Formulários validados** ponta a ponta com React Hook Form + Zod.

## Arquitetura

Monorepo (**Bun workspaces + Turborepo**). O front é same-origin: o browser sempre chama o próprio
domínio, e o **Next** faz proxy (rewrite no `next.config`) das rotas `/api/proxy/*` e `/api/auth/*`
para o backend no Fly — mantendo o **cookie de sessão first-party**.

```
Navegador ──▶ sniplinkjp.vercel.app (Next.js · Vercel)
                  │  /api/proxy/* · /api/auth/*  (rewrite no next.config)
                  ▼
            snip-link-api.fly.dev (Elysia · Fly.io)
                  └──▶ Neon (PostgreSQL)
```

| Camada | Tecnologias |
|---|---|
| **Web** | Next.js 15 (App Router · Turbopack) · React 19 · Tailwind CSS · shadcn/Radix · TanStack Query · Recharts · Framer Motion · React Hook Form + Zod |
| **API** | Bun · [Elysia](https://elysiajs.com) · Drizzle ORM · PostgreSQL · [Better Auth](https://better-auth.com) (Google + e-mail/senha) · Zod · OpenAPI |
| **Cliente HTTP** | Ky (fetch tipado, via proxy do Next) |
| **Infra** | Vercel (web) · Fly.io (API · containerizada) · Neon (DB) |
| **Qualidade** | TypeScript strict · Ultracite (Biome) · Husky · Prettier |

## Estrutura

```
apps/
  api/        # backend Elysia (rotas de links, analytics, redirect, auth, drizzle)
  web/        # front Next.js (landing, auth, dashboard, analytics + proxy de API/auth)
packages/
  ui/         # componentes shadcn/Radix compartilhados (Tailwind)
  env/        # validação de variáveis de ambiente (front + back)
  tsconfig/   # configs TypeScript base
```

## Rodando localmente

**Pré-requisitos:** [Bun](https://bun.sh) ≥ 1.2 e Docker (para o Postgres).

### Setup rápido

O repositório vem com um `setup.sh` que faz tudo (checa Bun/Docker, instala deps, configura `.env`,
sobe o Postgres, roda as migrations e inicia em modo dev):

```bash
chmod +x setup.sh
./setup.sh
```

### Setup manual

```bash
git clone git@github.com:devjpedro/snip-link.git
cd snip-link
bun install

# variáveis de ambiente (Google é opcional em dev)
cp .env.example .env

# sobe o Postgres
docker compose up -d

# aplica as migrations
bun run --filter @snip-link/api db:migrate

# sobe API (:3333) + web (:3000)
bun run dev
```

Abra **http://localhost:3000**. Em dev o login roda em modo `password` (e-mail/senha + signup); a
documentação da API fica em **http://localhost:3333/docs**.

## Variáveis de ambiente

Veja **[`.env.example`](.env.example)**. Resumo:

| Var | Para quê |
|---|---|
| `DATABASE_URL` | conexão Postgres |
| `BETTER_AUTH_SECRET` / `BETTER_AUTH_URL` | sessão/auth (o `URL` é o domínio do **front**, que assina o cookie) |
| `GOOGLE_CLIENT_ID` / `_SECRET` | login social (opcional em dev) |
| `NEXT_PUBLIC_BASE_URL` | domínio público do front |
| `NEXT_PUBLIC_API_URL` | domínio da API (consumido via proxy do Next, nunca direto no browser) |
| `NEXT_PUBLIC_AUTH_MODE` | `password` (dev) ou `google` (prod) |

## Scripts

```bash
bun run dev                        # sobe todos os apps em modo dev
bun run dev --filter=web           # só o front
bun run dev --filter=api           # só a API
bun run build                      # build de produção
bun run check && bun run fix       # Ultracite (lint/format) — check e auto-fix

# banco (na pasta apps/api)
bun run --filter @snip-link/api db:generate   # gera migrations
bun run --filter @snip-link/api db:migrate    # aplica migrations
bun run --filter @snip-link/api db:studio     # Drizzle Studio
```

## Deploy

Produção same-origin: **web na Vercel** + **API containerizada no Fly.io** + **Neon (Postgres)**.
O front publica em `sniplinkjp.vercel.app` e encaminha `/api/*` para `snip-link-api.fly.dev` via
rewrite do Next, preservando o cookie first-party. Em produção o login roda em modo `google`.

## Licença

Este projeto está sob a licença MIT.

## Autor

[@devjpedro](https://github.com/devjpedro)
