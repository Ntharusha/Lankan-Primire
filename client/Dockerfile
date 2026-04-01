# ── Stage 1: Build React/Vite app ───────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Only copy package.json first to cache layers
COPY package*.json ./
RUN npm ci

COPY . .

# Pass backend URL at build time (e.g. for API calls)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ── Stage 2: Serve with Nginx ────────────────────────────────────
FROM nginx:1.25-alpine

# Clean default Nginx files
RUN rm /etc/nginx/conf.d/default.conf

# Copy build artifacts to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx configuration for React SPA (handles client-side routing and API proxy)
RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
\n\
    location /api {\n\
        proxy_pass http://server-service:5000;\n\
        proxy_http_version 1.1;\n\
        proxy_set_header Upgrade $http_upgrade;\n\
        proxy_set_header Connection "upgrade";\n\
        proxy_set_header Host $host;\n\
        proxy_cache_bypass $http_upgrade;\n\
    }\n\
\n\
    gzip on;\n\
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;\n\
}\n' > /etc/nginx/conf.d/app.conf

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget -qO- http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
