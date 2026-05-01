FROM node:20-alpine

WORKDIR /app


# Install only production dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy app source
COPY . .

# Don't copy local .env — inject via --env-file or -e at runtime
RUN rm -f .env

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -q --spider http://localhost:5001/api/health || exit 1

CMD ["node", "index.js"]
