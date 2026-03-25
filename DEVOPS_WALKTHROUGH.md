# 🚀 Step-by-Step Manual DevOps Walkthrough

This guide provides every command and configuration needed to deploy your MERN stack application manually.

## Phase 1: Dockerization (Local Environment)

### 1. Backend Dockerfile
Create `server/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### 2. Frontend Dockerfile
Create [client/Dockerfile](file:///home/ghost69/projects/Projects/Lankan%20Primire/client/Dockerfile):
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Test Locally
Run these commands in the root:
```bash
docker build -t lankan-server ./server
docker build -t lankan-client ./client
```

---

## Phase 2: MongoDB Atlas (Free Database)

1. **Sign Up**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. **Create Cluster**: Pick **M0 (Free)**.
3. **Network Access**: Add IP Address `0.0.0.0/0` (Allow all).
4. **Database Access**: Create a user with a strong password.
5. **Get URI**: Click "Connect" -> "Drivers" -> Copy the connection string.

---

## Phase 3: AWS EC2 Setup (Free Compute)

1. **Launch Instance**: 
   - Name: `lankan-premiere-prod`
   - Image: `Ubuntu 22.04 LTS`
   - Instance Type: `t2.micro` (Free Tier)
2. **Security Group**: Open these ports:
   - `22` (SSH)
   - `80` (HTTP)
   - `5000` (Backend API)
3. **Connect via SSH**:
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```
4. **Install Docker**:
   ```bash
   sudo apt update
   sudo apt install docker.io -y
   sudo usermod -aG docker $USER
   newgrp docker
   ```

---

## Phase 4: GitHub Actions (CI/CD)

### 1. Repository Secrets
Go to **Settings > Secrets and variables > Actions** and add:
- `DOCKER_USERNAME` (Docker Hub)
- `DOCKER_PASSWORD` (Docker Hub Token)
- `EC2_SSH_KEY` (Your PEM file content)
- `EC2_IP` (Public IP of EC2)
- `MONGO_URI` (Atlas connection string)

### 2. Create Workflow
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to EC2
on:
  push:
    branches: [ main ]
jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Server Image
        run: docker build -t ${{ secrets.DOCKER_USERNAME }}/lankan-server:latest ./server
      - name: Push to Docker Hub
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
          docker push ${{ secrets.DOCKER_USERNAME }}/lankan-server:latest

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: SSH Deploy
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_IP }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            docker pull ${{ secrets.DOCKER_USERNAME }}/lankan-server:latest
            docker stop lankan-server || true
            docker rm lankan-server || true
            docker run -d --name lankan-server -p 5000:5000 \
              -e MONGO_URI="${{ secrets.MONGO_URI }}" \
              ${{ secrets.DOCKER_USERNAME }}/lankan-server:latest
```

---

## Phase 5: Vercel (Frontend Hosting)

1. **Import Repo**: Select your GitHub repo.
2. **Root Directory**: Select `client`.
3. **Build Command**: `npm run build`.
4. **Output Directory**: `dist`.
5. **Environment Variables**:
   - `VITE_API_URL`: `http://your-ec2-ip:5000/api`

---

## Phase 6: Monitoring (UptimeRobot)

1. Create a free account at [UptimeRobot](https://uptimerobot.com/).
2. Add Monitor for **Vercel URL** (Frontend).
3. Add Monitor for `http://your-ec2-ip:5000/api/health` (Backend).
