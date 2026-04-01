FROM node:18-alpine

WORKDIR /app

# Install only production dependencies first (better layer caching)
COPY package*.json ./
RUN npm install --omit=dev

# Copy app source
COPY . .

# Don't copy local .env — inject via --env-file or -e at runtime
RUN rm -f .env

EXPOSE 5000

CMD ["node", "index.js"]
