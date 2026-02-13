FROM node:20-alpine AS builder
WORKDIR /app
COPY package.jso[n] package-lock.jso[n] tsconfig.jso[n] ./
RUN if [ -f package.json ]; then npm ci; fi
COPY . .
RUN if [ -f tsconfig.json ]; then npm run build; fi

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package.jso[n] package-lock.jso[n] ./
RUN if [ -f package.json ]; then npm ci --omit=dev; fi
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]