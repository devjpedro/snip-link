# API (ElysiaJS + Bun) — imagem para deploy no Fly.io
FROM oven/bun:1 AS base
WORKDIR /app

# Desabilita husky (não há .git dentro da imagem) e marca produção
ENV HUSKY=0
ENV NODE_ENV=production
ENV PORT=3333

# Instala dependências do monorepo (workspaces) de forma reprodutível
COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/env/package.json ./packages/env/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/tsconfig/package.json ./packages/tsconfig/package.json
RUN bun install --frozen-lockfile

# Código-fonte
COPY . .

EXPOSE 3333
CMD ["bun", "apps/api/src/http/server.ts"]
