FROM node:20-alpine AS builder
WORKDIR /build
COPY package.json package-lock.jso[n] ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.jso[n] ./
RUN npm ci --only=production
COPY --from=builder /build/dist ./dist
EXPOSE 3000
USER node
CMD ["node", "dist/index.js"]