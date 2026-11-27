# syntax=docker/dockerfile:1

# ---------- base ----------
FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---------- dependências ----------
FROM base AS deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

# ---------- build ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# public/ pode não vir do Git (pasta vazia não é versionada); o runner copia ela
RUN mkdir -p public && npm run build

# ---------- runtime ----------
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# cache das imagens otimizadas pelo next/image (montado como volume no compose)
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next/cache

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/acesso > /dev/null || exit 1

CMD ["node", "server.js"]
