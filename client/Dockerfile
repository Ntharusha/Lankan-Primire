FROM node:18

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build the project
RUN npm run build

# Expose the frontend port (Vite default is 3000 in preview mode)
EXPOSE 3000

# Start a simple preview server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
