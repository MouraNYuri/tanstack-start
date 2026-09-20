# Multi-stage build para manter a imagem leve
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Executa a migration/drizzle se necessário e gera o build de produção
RUN npm run build

# Estágio de Execução
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copia dependências e build do estágio anterior
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output

EXPOSE 3000

# TanStack Start / Vinxi usa a pasta .output para rodar o servidor em produção
CMD ["node", ".output/server/index.mjs"]