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
echo "🚀 Iniciando servidor API na porta 3333..."
exec bun run src/http/server.ts