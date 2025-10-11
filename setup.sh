#!/usr/bin/env bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções auxiliares
print_step() {
  echo -e "\n${BLUE}==>${NC} ${1}"
}

print_success() {
  echo -e "${GREEN}✔${NC} ${1}"
}

print_error() {
  echo -e "${RED}✖${NC} ${1}"
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} ${1}"
}

# Banner
echo -e "${BLUE}"
cat << "EOF"
   ____       _         __    _       __  
  / ___| ___ (_)_ __   / /   (_)_ __ / /__
  \___ \/ _ \| | '_ \ / /    | | '_ \ / / /
   ___) | (_| | | |_) / /___  | | | | \  \ 
  |____/\___/|_| .__/\____/ |_|_| |_| /_/\_\
               |_|                          
                                            
  🔗 Encurtador de Links Moderno
EOF
echo -e "${NC}"

# Verificar se Bun está instalado
print_step "Verificando dependências..."

if ! command -v bun &> /dev/null; then
  print_error "Bun não está instalado!"
  echo "Por favor, instale Bun executando:"
  echo "curl -fsSL https://bun.sh/install | bash"
  exit 1
fi
print_success "Bun $(bun --version) encontrado"

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
  print_error "Docker não está instalado!"
  echo "Por favor, instale Docker em: https://docs.docker.com/get-docker/"
  exit 1
fi
print_success "Docker $(docker --version | cut -d ' ' -f3 | cut -d ',' -f1) encontrado"

# Verificar se Docker Compose está instalado
if ! command -v docker compose &> /dev/null; then
  print_error "Docker Compose não está instalado!"
  exit 1
fi
print_success "Docker Compose encontrado"

# Instalar dependências
print_step "Instalando dependências..."
if bun install; then
  print_success "Dependências instaladas com sucesso"
else
  print_error "Erro ao instalar dependências"
  exit 1
fi

# Configurar arquivo .env
print_step "Configurando variáveis de ambiente..."

if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    print_success "Arquivo .env criado a partir do .env.example"
  else
    # Gerar secret aleatória
SECRET_KEY=$(openssl rand -hex 32)

# Criar .env do zero com secret gerada
cat > .env << EOF
# Database
DATABASE_URL="postgresql://docker:docker@localhost:5432/snip-link-db"

# Auth
BETTER_AUTH_SECRET="${SECRET_KEY}"
BETTER_AUTH_URL="http://localhost:3000"

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL="http://localhost:3333"
EOF

  print_success "Arquivo .env criado com uma secret aleatória"
  fi
  
  print_warning "⚠️  IMPORTANTE: Edite o arquivo .env e configure:"
  print_warning "   - BETTER_AUTH_SECRET (use uma chave secreta forte)"
  echo ""
  read -p "Pressione ENTER para continuar após configurar o .env..."
else
  print_success "Arquivo .env já existe"
fi

# Iniciar banco de dados
print_step "Iniciando PostgreSQL com Docker..."
if docker compose up -d; then
  print_success "PostgreSQL iniciado com sucesso"
  
  # Aguardar banco estar pronto
  echo "Aguardando PostgreSQL ficar pronto..."
  sleep 5
  
  # Verificar se está rodando
  if docker compose ps | grep -q "Up"; then
    print_success "PostgreSQL está rodando"
  else
    print_error "Erro ao iniciar PostgreSQL"
    exit 1
  fi
else
  print_error "Erro ao iniciar Docker Compose"
  exit 1
fi

# Executar migrations
print_step "Executando migrations do banco de dados..."
cd apps/api

# Gerar migrations
if bun run db:generate; then
  print_success "Migrations geradas"
else
  print_warning "Erro ao gerar migrations (pode ser normal se já existirem)"
fi

# Executar migrations
if bun run db:migrate; then
  print_success "Migrations executadas com sucesso"
else
  print_error "Erro ao executar migrations"
  cd ../..
  exit 1
fi

cd ../..

# Configurar git hooks
print_step "Configurando Git hooks com Husky..."
if bun run prepare; then
  print_success "Git hooks configurados"
else
  print_warning "Não foi possível configurar Git hooks (opcional)"
fi

# Finalização
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ Setup concluído com sucesso!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}🚀 Iniciando projeto em modo desenvolvimento...${NC}"
echo ""

bun run dev