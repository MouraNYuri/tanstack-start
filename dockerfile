# Multi-stage build com Bun
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copia manifestos e lockfiles
COPY package.json bun.lock* ./

# Instala dependências de forma congelada
RUN bun install --frozen-lockfile

COPY . .

# Executa o build do TanStack Start
RUN bun run build

# --- Estágio de Execução ---
FROM oven/bun:1-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copia os arquivos gerados pelo build do TanStack Start / Vinxi
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./

EXPOSE 3000

# Inicia a aplicação usando Bun
CMD ["bun", "run", ".output/server/index.mjs"]