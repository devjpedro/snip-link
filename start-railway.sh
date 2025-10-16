#!/bin/bash
set -e

echo "🚀 Starting Railway deployment..."

# Iniciar API em background
echo "📡 Starting API..."
cd apps/api
bun run start &
API_PID=$!

# Aguardar API estar pronta
echo "⏳ Waiting for API to be ready..."
for i in {1..30}; do
  if curl -f http://localhost:3333/health > /dev/null 2>&1; then
    echo "✅ API is ready!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "❌ API failed to start in time"
    exit 1
  fi
  echo "   Attempt $i/30..."
  sleep 1
done

# Iniciar Next.js
echo "🌐 Starting Next.js..."
cd ../web
bun run start