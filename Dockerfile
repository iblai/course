# Stage 0: Base
FROM node:22-alpine AS base
WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=8192"

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV CI=true

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# Stage 1: Builder
FROM base AS builder
WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=8192"

COPY . .
RUN pnpm run build

# Stage 2: Runner (Next.js standalone)
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libstdc++

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 5000
ENV PORT=5000
ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "server.js"]
