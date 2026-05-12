# 📽️ Technical Project Report: Lankan Primire
**A Production-Ready Cinema Management & DevOps Showcase**

## 1. Project Overview
Lankan Primire is a full-stack movie ticketing application designed with a focus on **Operational Excellence** and **Scalability**. The project serves as a comprehensive showcase of modern software engineering and DevOps practices, featuring a hybrid cloud architecture and fully automated deployment pipelines.

## 2. System Architecture
The system uses a decoupled, hybrid cloud architecture to optimize for performance and cost.

*   **Frontend:** React.js hosted on Vercel (Global CDN).
*   **Backend:** Express.js Node server running in Docker on AWS EC2.
*   **Database:** MongoDB Atlas (Cloud Managed).
*   **Networking:** Vercel Rewrites used as a reverse proxy to bypass Mixed Content restrictions and simplify API calls.

---

## 3. The DevOps Stack (The "Engine")
The project’s core strength lies in its automation and management layer.

### 🛠️ Infrastructure as Code (IaC)
Used **Terraform** to define and provision AWS resources (EC2, VPC, Security Groups). This ensures that the production environment can be destroyed and recreated in minutes with zero manual configuration.

### 🔄 CI/CD Pipeline
A custom **GitHub Actions** workflow handles the entire lifecycle:
1.  **Continuous Integration:** Automated linting and unit testing for both client and server.
2.  **Continuous Deployment:** 
    *   Builds and pushes multi-service Docker images to Docker Hub.
    *   Triggers a remote deployment on EC2 via SSH.
    *   Performs secure environment variable injection using `.env` files to protect sensitive keys.

### 🐳 Containerization
The application stack is orchestrated using **Docker Compose**, managing:
*   `app-server`: The Express.js backend.
*   `prometheus`: Metrics collection.
*   `grafana`: Data visualization.
*   `node-exporter`: Host hardware monitoring.
*   `cadvisor`: Container-specific metrics.

---

## 4. Monitoring & Observability
A professional-grade monitoring suite was implemented to ensure 99.9% uptime and performance visibility.

*   **Prometheus:** Scrapes metrics from the Express app, host machine, and Docker containers.
*   **Grafana:** Provides real-time dashboards for:
    *   API Latency & Request Rates.
    *   CPU/RAM utilization of the EC2 instance.
    *   Memory footprint of individual Docker containers.

---

## 5. Security Implementation
*   **JWT Authentication:** Secure stateless session management for users.
*   **Secret Masking:** Sensitive data (MongoDB URI, Stripe Keys) are never committed to code; they are injected during deployment via GitHub Secrets.
*   **Role-Based Access Control (RBAC):** Strict separation between user-facing routes and administrative dashboards.
*   **SSH Protection:** Remote deployment is handled via dedicated SSH keys with restricted access.

---

## 6. Conclusion
Lankan Primire is more than a ticketing app; it is a demonstration of how modern cloud technologies can be integrated into a seamless, automated, and observable system. It represents a "production-first" mindset where maintenance and monitoring are as important as the code itself.
