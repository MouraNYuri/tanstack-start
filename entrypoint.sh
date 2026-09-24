#!/bin/sh
set -e

echo "🚀 Rodando migrações do Drizzle..."
bun run db:migrate

echo "✅ Migrações concluídas com sucesso! Iniciando a aplicação..."
exec "$@"