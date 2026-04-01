# ── Stage 1: Build ──────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Only copy package.json first to cache layers
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# ── Stage 2: Production ─────────────────────────────────────────
FROM node:18-alpine

# Security: Don't run as root in production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only production dependencies and source from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Assign ownership to non-root user
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "index.js"]
