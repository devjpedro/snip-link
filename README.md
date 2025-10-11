# Snip Link 🔗

[SnipLink preview](https://github.com/user-attachments/assets/60ed3257-c405-4c4c-8506-2c63773b809e)

![App Screenshot](https://jam.dev/cdn-cgi/image/width=1600,quality=100,dpr=1/https://cdn-jam-screenshots.jam.dev/d76bd5b4498d4552fabf57f3f57c8d08/screenshot/49ed874c-7e30-4d1e-8438-5893e29ddc01.png)

> Snip Link é um encurtador de links moderno e minimalista, construído com as tecnologias mais recentes.
> O projeto oferece uma arquitetura escalável baseada em monorepo, com autenticação robusta, analytics em tempo real e uma interface elegante.
> O objetivo desse projeto foi treinar minhas habilidades com Next.js e também colocar em prática novos conhecimentos em criação de API com Elysia

## 🚀 Principais Recursos

#### 🔐 Autenticação

- Autenticação completa com Better Auth
- Login e registro via email/senha
- Gestão de sessões segura
- Proteção de rotas no frontend e backend

#### 🔗 Gestão de Links

- Criação de links encurtados com aliases personalizados ou automáticos
- Listagem e gerenciamento de todos os links criados
- Ativação/desativação de links
- Exclusão de links com histórico de cliques

#### 📊 Analytics Avançado

- Dashboard com estatísticas em tempo real
- Gráficos de cliques ao longo do tempo
- Métricas de total de cliques e links criados
- Visualização de dados com Recharts

#### 🎨 Interface Moderna

- Design responsivo e acessível com Tailwind CSS
- Componentes reutilizáveis com ShadCN UI
- Tema claro/escuro
- Animações suaves com Framer Motion
- Infinite scroll para listagem de links

## Arquitetura e Stack de Tecnologias

#### 🧱 Arquitetura

O projeto adota uma arquitetura **monorepo** utilizando **Turborepo** e **Bun workspaces**, organizando o código em aplicações separadas para **front-end**, **back-end**, e **módulos compartilhados** (UI, configurações de TypeScript, e variáveis de ambiente).

```
snip-link/
├── apps/
│   ├── api/              # Backend API (Elysia.js)
│   └── web/              # Frontend (Next.js 15)
├── packages/
│   ├── ui/               # Componentes compartilhados
│   ├── env/              # Variáveis de ambiente
│   └── tsconfig/         # Configurações TypeScript
```

---

#### 🎨 Front-end

Aplicação construída com **Next.js 15** e **React 19**, focada em uma interface moderna, acessível e responsiva. As principais bibliotecas e ferramentas incluem:

- **Next.js 15** — framework React com App Router e Turbopack
- **React 19** — biblioteca para interfaces de usuário
- **Tailwind CSS** — estilização utilitária moderna
- **ShadCN UI** — componentes acessíveis e estilizados
- **Lucide React** — biblioteca de ícones SVG
- **React Query** (`@tanstack/react-query`) — gerenciamento de estado assíncrono e cache
- **Next Themes** — suporte a tema escuro/claro
- **Framer Motion** — animações fluidas
- **Recharts** — gráficos e visualização de dados
- **Ky** — cliente HTTP leve baseado em `fetch`
- **React Hook Form + Zod** — validação de formulários
- **Better Auth** — autenticação no frontend
- **Sonner** — notificações toast elegantes

---

#### ⚙️ Back-end

API construída com **Elysia.js** rodando no **Bun runtime**, projetada para alta performance e validada com **Zod**. Utiliza **Drizzle ORM** para persistência com PostgreSQL.

Principais tecnologias:

- **Elysia.js** — framework web extremamente rápido para Bun
- **Bun** — runtime JavaScript/TypeScript de alta performance
- **Better Auth** — autenticação baseada em sessões e JWT
- **Drizzle ORM** — ORM TypeScript-first para PostgreSQL
- **PostgreSQL** — banco de dados relacional robusto
- **Zod** — validação de schemas e entrada de dados
- **Bcrypt** — hash seguro de senhas
- **UUID** — geração de identificadores únicos
- **@elysiajs/cors** — configuração de CORS
- **@elysiajs/openapi** — documentação automática da API

---

#### 📦 Ferramentas e Qualidade

- **Turborepo** — sistema de build otimizado para monorepos
- **Bun** — gerenciador de pacotes e runtime
- **TypeScript** — tipagem estática
- **Ultracite** — linter e formatter baseado em Biome
- **Husky** — git hooks para qualidade de código
- **Docker Compose** — containerização do PostgreSQL

## 🚀 Como rodar o projeto

### ✅ Pré-requisitos

Antes de começar, instale:

- [Bun](https://bun.sh/) (recomendado: v1.2+) - `curl -fsSL https://bun.sh/install | bash`
- [Docker](https://www.docker.com/) e Docker Compose
- [Git](https://git-scm.com/)

---

### ⚡ Setup rápido (recomendado)

O projeto já vem com um script `setup.sh` que faz tudo por você.

```bash
chmod +x setup.sh
./setup.sh
```

O script irá:

1. ✅ Verificar se Bun e Docker estão instalados
2. ✅ Instalar todas as dependências
3. ✅ Configurar o arquivo `.env`
4. ✅ Iniciar o PostgreSQL com Docker
5. ✅ Rodar as migrations do banco de dados
6. ✅ Iniciar a aplicação em modo desenvolvimento

---

### 🔧 Setup manual

Se preferir fazer manualmente:

#### 1. Clone o repositório

```bash
git clone https://github.com/devjpedro/snip-link.git
cd snip-link
```

#### 2. Instale as dependências

```bash
bun install
```

#### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_URL="postgresql://docker:docker@localhost:5432/snip-link-db"

# Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# API
API_URL="http://localhost:3333"
```

#### 4. Inicie o banco de dados

```bash
docker compose up -d
```

#### 5. Execute as migrations

```bash
cd apps/api
bun run db:generate
bun run db:migrate
cd ../..
```

#### 6. Inicie o projeto em modo dev

```bash
bun run dev
```

A aplicação estará disponível em:

- 🌐 Frontend: http://localhost:3000
- 🔌 API: http://localhost:3333
- 📚 API Docs: http://localhost:3333/docs

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
bun run dev              # Inicia todos os apps em modo dev
bun run dev --filter=web # Inicia apenas o frontend
bun run dev --filter=api # Inicia apenas a API

# Build
bun run build            # Build de produção de todos os apps

# Qualidade de código
bun run lint             # Verifica problemas de lint
bun run check            # Verifica código com Ultracite
bun run fix              # Corrige automaticamente problemas

# Banco de dados (na pasta apps/api)
cd apps/api
bun run db:generate      # Gera migrations
bun run db:migrate       # Executa migrations
bun run db:studio        # Abre Drizzle Studio
```

---

## 🗂️ Estrutura do Projeto

### Apps

#### `apps/api` - Backend API

- Elysia.js + Bun runtime
- Autenticação com Better Auth
- Rotas para links, analytics e redirecionamento
- Drizzle ORM + PostgreSQL

#### `apps/web` - Frontend

- Next.js 15 com App Router
- Páginas: landing, auth, dashboard, analytics
- Componentes reutilizáveis
- Integração com API via React Query

### Packages

#### `packages/ui`

- Componentes ShadCN UI customizados
- Buttons, Forms, Cards, Charts, etc.
- Estilos com Tailwind CSS

#### `packages/env`

- Validação de variáveis de ambiente
- Compartilhado entre frontend e backend

#### `packages/tsconfig`

- Configurações TypeScript base
- Configs específicas para web e api

---

## 🔐 Autenticação

O projeto utiliza **Better Auth** para autenticação completa:

- Registro e login com email/senha
- Hash de senhas com bcrypt
- Sessões seguras
- Middleware de proteção de rotas
- Sincronização entre frontend e backend

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👤 Autor

[@devjpedro](https://github.com/devjpedro)
