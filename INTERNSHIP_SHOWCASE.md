# 🎓 Full-Stack + DevOps Internship Technical Showcase Guide

> **Project:** Lankan Primire  
> **Target Roles:** Full-Stack Developer Internship / DevOps Engineer Internship / Cloud Software Engineer Internship  
> **Repository:** [Lankan Primire GitHub Repository](https://github.com/your-username/lankan-primire)  
> **Live Demo:** [https://lankan-primire.vercel.app](https://lankan-primire.vercel.app) | **Swagger API Specs:** `/api-docs`

---

## 🎯 1. The 30-Second Elevator Pitch

### 🇬🇧 English Pitch (For Technical Interviews)
> *"Lankan Primire is a high-concurrency cinema management and ticketing platform engineered to handle real-time seat synchronization and automated cloud deployment. On the full-stack side, I built a React/Vite frontend connected to a Node.js/Express REST API with Socket.IO WebSockets to prevent double-booking race conditions through atomic MongoDB seat locks. On the DevOps side, I containerized the services using multi-stage Dockerfiles, provisioned AWS infrastructure with Terraform, automated testing and security audits via GitHub Actions CI/CD, and set up full observability using Prometheus metrics and Grafana dashboards, as well as Kubernetes manifests for container orchestration."*

### 🇱🇰 Sinhala Pitch (Interview Preparation Context)
> *"Lankan Primire කියන්නේ real-time cinema seat booking platform එකක්. Full-stack විදියට React/Vite frontend එකයි Node.js/Express backend එකයි Socket.IO WebSockets use කරලා real-time seat locking mechanism එකක් හැදුවා (double booking වළක්වන්න). DevOps පැත්තෙන් Multi-stage Dockerization, Terraform හරහා AWS Infrastructure provisioning, GitHub Actions CI/CD pipeline එකට DevSecOps (Trivy security scan) එකතු කරලා, Prometheus + Grafana monitoring සහ Kubernetes (K8s) deployment setup එකක් සම්පූර්ණයෙන්ම automated කළා."*

---

## 🏗️ 2. Key Architecture & Engineering Decisions

```mermaid
graph TB
    subgraph Client["1. Frontend & Client (React 18 + Vite)"]
        UI[React UI + Framer Motion]
        WS_CLIENT[Socket.IO Client]
    end

    subgraph API_GW["2. API Gateway & Documentation"]
        SWAGGER[Swagger / OpenAPI UI (/api-docs)]
        MW[Security Middleware: Helmet + CORS + Rate Limit]
    end

    subgraph Backend["3. Backend Microservices (Express.js)"]
        REST[REST API Routes]
        SOCKET[Socket.IO Seat Locking Server]
        BG_CLEANUP[2-Min Auto Lock Sweeper]
    end

    subgraph Database["4. Persistence Layer"]
        MONGO[(MongoDB Atlas / Local Mongo)]
    end

    subgraph Infra["5. Cloud & DevOps Infrastructure"]
        TF[Terraform IaC]
        AWS[AWS EC2 + Elastic IP]
        K8S[Kubernetes Pods + Service + HPA]
        GA[GitHub Actions CI/CD + Trivy Scan]
    end

    subgraph Monitoring["6. Observability Stack"]
        PROM[Prometheus Scraper]
        GRAF[Grafana Dashboard]
    end

    UI --> MW --> REST --> MONGO
    WS_CLIENT <--> SOCKET <--> MONGO
    SOCKET --> BG_CLEANUP
    GA --> TF --> AWS --> K8S
    PROM --> REST
    GRAF --> PROM

    style Client fill:#1a1a2e,stroke:#e94560,color:#fff
    style API_GW fill:#0f3460,stroke:#e94560,color:#fff
    style Backend fill:#16213e,stroke:#0f3460,color:#fff
    style Database fill:#1a1a2e,stroke:#533483,color:#fff
    style Infra fill:#0f3460,stroke:#00b894,color:#fff
    style Monitoring fill:#16213e,stroke:#533483,color:#fff
```

---

## 💻 3. Full-Stack Technical Highlights

### ⚡ 1. Real-Time Seat Synchronization & Concurrency Control
* **Problem**: When multiple users attempt to select the same cinema seat at the exact same second, naive implementations suffer from **race conditions** leading to double-booking.
* **Solution**: Implemented **Socket.IO room channels** (`join_show`). When a user taps a seat:
  1. The server executes an **atomic update** in MongoDB checking if the seat is unlocked.
  2. If succeeded, Socket.IO broadcasts a `seat_locked` event to all other clients in that show's room, instantly graying out the seat.
  3. An automatic background sweeper interval runs every 2 minutes to release locks older than 10 minutes, preventing abandoned seats from staying locked.

### 🛡️ 2. Authentication & Authorization
* **JWT Authentication**: Secured REST endpoints using JSON Web Tokens passed in Authorization HTTP headers.
* **Role-Based Access Control (RBAC)**: Admin routes (e.g. `/api/seed` and show management) require `admin` privileges verified via custom middleware.

### 📄 3. OpenAPI / Swagger Documentation (`/api-docs`)
* Served interactive OpenAPI 3.0 documentation directly via Express at `/api-docs`.
* Allows developers and recruiters to test endpoints interactively without external Postman collections.

---

## ☁️ 4. DevOps & Cloud Engineering Highlights

### 🐳 1. Optimized Multi-Stage Docker Containerization
* **Frontend (`client/Dockerfile`)**: 
  - **Stage 1 (Build)**: Node 20 environment compiles Vite production assets.
  - **Stage 2 (Runtime)**: Ultra-lightweight `nginx:alpine` image serves static dist files and proxies `/api` calls.
* **Backend (`server/Dockerfile`)**:
  - Uses `node:20-alpine` base image with `npm ci` for deterministic production builds and non-root process execution.

### 📜 2. Infrastructure as Code (Terraform)
* Provisioned AWS EC2 (`t2.micro`), Security Groups (exposing ports 22, 80, 5000, 9090, 3001), and AWS Elastic IP (EIP) using **Terraform declarative scripts** (`infrastructure/terraform/main.tf`).
* User Data bootstrap scripts automatically install Docker and initialize host setup on spin-up.

### ☸️ 3. Kubernetes Orchestration (`k8s/`)
* **Namespace Isolation**: `lankan-primire` namespace.
* **Deployments & Services**: 2 Replicas for Backend and Frontend with ClusterIP service routing.
* **Probes**: Configured `livenessProbe` and `readinessProbe` targeting `/api/health`.
* **Autoscaling**: `HorizontalPodAutoscaler` (HPA) auto-scales backend pods from 2 up to 10 based on CPU/Memory thresholds.
* **Ingress**: Nginx Ingress routing HTTP and WebSocket connections.

### 🔄 4. DevSecOps CI/CD Pipeline (`.github/workflows/ci.yml`)
* **Lint & Test**: Jest backend unit tests + Vitest frontend component tests.
* **Security Scanning**: **Trivy vulnerability scanner** scans Docker images for OS/library vulnerabilities before pushing to Docker Hub.
* **Automated CD**: Secure SSH deployment to AWS EC2, pulling latest tags and executing zero-downtime container swaps with docker compose image pruning.

### 📊 5. Observability & Monitoring (Prometheus + Grafana)
* **Prometheus**: Scrapes node system metrics, container stats via cAdvisor, and Express runtime metrics via `prom-client` at `/metrics`.
* **Grafana**: Pre-configured JSON dashboards (`grafana/provisioning/dashboards/`) displaying request rates, HTTP 5xx error spikes, memory consumption, and active WebSocket connections.

---

## ❓ 5. Top 10 Technical Interview Questions & Model Answers

### Q1: How did you handle race conditions in seat booking?
> **Answer**: *"I combined WebSockets via Socket.IO with atomic MongoDB updates. When a user clicks a seat, the server checks seat availability atomically. If available, it marks the seat locked with a timestamp and broadcasts a `seat_locked` message to all users viewing that show. If another user requests the seat simultaneously, the atomic query fails and returns a lock conflict error to the second user."*

### Q2: Why did you choose Terraform over manual AWS console setup?
> **Answer**: *"Terraform provides version-controlled Infrastructure as Code (IaC). Instead of manual point-and-click setup in the AWS Console—which is error-prone and hard to replicate—Terraform manifests define our VPC, Security Groups, EC2 instances, and Elastic IPs reproducibly. If we need to spin up a staging environment, it takes a single `terraform apply` command."*

### Q3: Why did you use multi-stage Docker builds for the frontend?
> **Answer**: *"A Node.js build environment contains heavy devDependencies and node_modules (~500MB+). Using a multi-stage build allows us to compile the static JavaScript bundle in Stage 1 and copy only the built `/dist` assets into a lightweight `nginx:alpine` image (~25MB) in Stage 2. This drastically reduces container security attack surface and deployment transfer time."*

### Q4: How does your CI/CD pipeline ensure zero downtime deployment?
> **Answer**: *"In GitHub Actions, code changes pass unit tests, linting, and Trivy security scans first. Once container images are built and pushed to Docker Hub, an SSH action connects to the EC2 host. Docker Compose pulls the updated image tags, starts new container instances, verifies health checks, and prunes old images without stopping the running service."*

### Q5: How do you monitor application performance in production?
> **Answer**: *"I integrated `prom-client` into Express to expose application metrics at `/metrics`. Prometheus scrapes these metrics along with system stats from Node Exporter and cAdvisor. Grafana visualizes key Golden Signals: latency, traffic rate, error percentages, and CPU/memory utilization."*

### Q6: How is sensitive data managed across environments?
> **Answer**: *"Database credentials, JWT keys, and third-party API keys are never hardcoded. In local development, they live in `.env` files (git-ignored). In production, GitHub Repository Secrets inject values into the CI/CD pipeline, and Kubernetes uses `Secret` and `ConfigMap` objects mounted into pod environments."*

### Q7: How does Kubernetes handle scaling during high traffic?
> **Answer**: *"I created a HorizontalPodAutoscaler (HPA) manifest. When CPU utilization exceeds 70% or memory exceeds 80%, HPA automatically scales the Express backend deployment from 2 replicas up to 10. The Kubernetes Service load balances incoming requests across all healthy pods."*

### Q8: What security practices did you implement on the backend?
> **Answer**: *"I implemented Helmet to set secure HTTP headers (X-Content-Type-Options, Frameguard), express-rate-limit to protect against brute-force attacks (100 requests per 15 mins), bcryptjs for password hashing, JWT for stateless authentication, and Trivy vulnerability scanning in CI/CD."*

### Q9: How do WebSockets function through Nginx / Kubernetes Ingress?
> **Answer**: *"WebSockets require HTTP Upgrade headers (`Upgrade: websocket`, `Connection: Upgrade`). In both Nginx reverse proxy configs and Kubernetes Ingress annotations (`nginx.ingress.kubernetes.io/websocket-services`), I configured proxy timeouts to 3600s and allowed connection upgrading to maintain persistent Socket.IO connections."*

### Q10: If this platform scaled to 1,000,000 users, what would you refactor next?
> **Answer**: *"I would introduce Redis for two purposes: 1) Redis Pub/Sub backplane to scale Socket.IO across multiple Node backend pods, and 2) Redis in-memory cache for seat lock state to reduce MongoDB write pressure. I'd also split the QR code generation and email notifications into an asynchronous task queue using RabbitMQ or AWS SQS."*

---

## 📌 Summary Checklist for Internship Applications

- [x] Full-stack architecture (React, Express, MongoDB, WebSockets)
- [x] Real-time concurrency handling & background cleanups
- [x] OpenAPI / Swagger documentation (`/api-docs`)
- [x] Containerization with multi-stage Docker builds
- [x] Infrastructure as Code with Terraform
- [x] Kubernetes manifests (Deployments, Services, HPA, Ingress)
- [x] Automated DevSecOps CI/CD pipeline with Trivy vulnerability scanning
- [x] Full Observability stack with Prometheus & Grafana
