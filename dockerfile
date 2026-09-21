# Estágio de Build
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copia manifestos e instala dependências
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copia o código-fonte
COPY . .

# Executa o build do Vite
RUN bun run build

# --- Estágio de Execução ---
FROM oven/bun:1-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copia o diretório `dist` gerado pelo Vite e as dependências
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Inicia a aplicação usando Bun no servidor do Vite/TanStack
CMD ["bun", "run", "start"]