# Technical Project Report: Lankan Primire
**A Personal DevOps and Full-Stack Learning Showcase**

## 1. Project Overview
Lankan Primire is a full-stack movie ticketing web application that I built to gain hands-on experience with modern software engineering and DevOps practices. My goal was to create a functional application and deploy it using automated pipelines, containerization, and basic infrastructure provisioning. This project represents my practical learning journey in setting up a clean CI/CD workflow, hosting applications on AWS, and configuring system monitoring.

## 2. System Architecture
I structured the application into a decoupled architecture to learn how different services communicate across host boundaries:

* **Frontend:** A React client (bundled with Vite) hosted on Vercel to take advantage of its quick deployment and global static hosting.
* **Backend API:** An Express.js Node server running containerized in Docker on an AWS EC2 instance.
* **Database:** MongoDB Atlas (cloud-managed database) to store movies and booking transactions.
* **Networking & Reverse Proxy:** I used Vercel rewrites to route client API requests to the backend server. This helped me resolve CORS issues and keep the API calls clean.

---

## 3. Infrastructure & Containerization Setup

### Infrastructure as Code (IaC)
To understand how cloud resources are provisioned automatically, I used **Terraform**:
* I defined the basic AWS configuration, including a Security Group (enforcing ingress/egress rules for SSH, HTTP, and the monitoring ports), a t2.micro EC2 instance, and an Elastic IP to keep the server IP static.
* This setup helped me learn how to create and destroy staging resources consistently without configuring them manually in the AWS Console.

### Container Orchestration
I containerized the applications using **Docker** and managed them with **Docker Compose** on the EC2 instance. The stack includes:
* `app-server`: The Express.js backend container.
* `prometheus`: For collecting metrics from the system.
* `grafana`: To visualize those metrics.
* `node-exporter` and `cadvisor`: To export host hardware metrics and individual container resource stats.

---

## 4. CI/CD Pipeline
I designed a basic automation pipeline using **GitHub Actions** (`.github/workflows/ci.yml`) to automatically test and deploy changes:

1. **Continuous Integration (CI):**
   * Whenever I push code or create a pull request on the `main` or `dev` branches, the pipeline automatically installs dependencies (`npm ci`), runs ESLint for frontend code formatting, and executes unit tests (Vitest for client, Jest for server).
2. **Continuous Deployment (CD):**
   * After the tests pass, the pipeline builds production Docker images using `docker buildx` and pushes them to my Docker Hub registry.
   * Then, it triggers an SSH command to my EC2 instance, pulls the updated images, restarts the containers using Docker Compose, and prunes old images to save disk space.

---

## 5. Monitoring & Observability
I integrated a monitoring stack to learn how to keep track of a running application's health:

* **Prometheus:** Configured to scrape metrics from the Express backend and the server host.
* **Grafana:** I set up basic dashboards to display real-time statistics such as memory and CPU usage of the EC2 instance and Docker containers, helping me learn how to spot potential performance issues.

---

## 6. Security Practices
* **Authentication:** I used JSON Web Tokens (JWT) to handle user sessions securely.
* **Secrets Management:** I kept sensitive credentials (like MongoDB strings, Stripe keys, and SSH private keys) out of my code repository by injecting them as GitHub repository secrets during the deployment phase.
* **Firewall Rules:** I limited open ports on my EC2 security group to only allow essential traffic (SSH, HTTP, application ports, and monitoring dashboards).

---

## 7. Project Reflection
Building Lankan Primire helped me connect application development with operational tasks. By setting up the server, writing CI/CD workflows, and configuring basic monitoring, I gained a practical, end-to-end understanding of how to manage and deploy web applications.
