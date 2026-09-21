# Estágio de Build
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copia manifestos e instala dependências
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copia o código-fonte
COPY . .

# Executa o build de produção do TanStack Start
RUN bun run build

# --- Estágio de Execução ---
FROM oven/bun:1-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# 1. Copia o diretório compilado correto gerado pelo TanStack Start
COPY --from=builder /app/.tanstack ./.tanstack
COPY --from=builder /app/package.json ./
# Copia as node_modules necessárias para produção
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# 2. Executa a aplicação apontando para o bundle de produção do TanStack Start
CMD ["bun", ".tanstack/start/build/server/index.js"]