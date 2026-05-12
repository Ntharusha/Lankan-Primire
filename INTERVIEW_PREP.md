# 🎬 Lankan Primire — DevOps Internship Interview Prep
> 50 project-specific Q&A across Architecture, CI/CD, Docker, Terraform, and Observability

---

## 📦 Section 1 — Project Architecture & Full-Stack (Q1–Q12)

**Q1. Give me a 2-minute overview of the Lankan Primire project.**

> Lankan Primire is a real-time movie ticketing platform built with React, Node.js/Express, and MongoDB Atlas. Users browse movies, pick seats on a live seat map, pay, and receive a digital QR-code ticket by email. Socket.IO handles real-time seat locking — when one user selects a seat, all other users in that show room see it update instantly. The platform is containerised with Docker, deployed on AWS EC2 provisioned by Terraform, monitored with Prometheus and Grafana, and has a full GitHub Actions CI/CD pipeline.

---

**Q2. How did you prevent double-booking under concurrent load?**

> I used MongoDB's atomic `findOneAndUpdate` with `arrayFilters` in `showService.js`. The `lockSeat()` function finds a seat only if it is `isAvailable: true` AND (`isLocked: false` OR lock expired OR locked by the same user) — all in one DB operation. Because MongoDB guarantees document-level atomicity, two simultaneous requests for the same seat can never both succeed. The loser gets null and receives "Seat is currently locked by another user." Socket.IO then broadcasts the lock to all clients in the show room.

---

**Q3. Walk me through the Socket.IO seat-locking flow end to end.**

> 1. User opens a show → `socket.emit('join_show', showId)` → server calls `socket.join(showId)`
> 2. User clicks a seat → client emits `lock_seat { showId, seatNumber, userId }`
> 3. Server calls atomic `lockSeat()`. On success broadcasts `seat_locked` to everyone else via `socket.to(showId).emit(...)`
> 4. On disconnect → `unlockAllUserSeats(userId)` releases that socket's held locks
> 5. A `setInterval` every 2 minutes calls `releaseExpiredLocks()` to clean up stale 10-minute holds

---

**Q4. What is idempotency and how did you implement it?**

> Idempotency means the same request multiple times produces the same result. In `POST /api/bookings`, before creating a booking I check if a `paymentIntentId` already exists in the DB. If found, I return the existing booking with `200 OK` instead of creating a duplicate — preventing double-saves from network retries or accidental double-clicks.

---

**Q5. How does the digital ticket delivery work?**

> After a booking is saved, `sendBookingConfirmation(booking)` fires asynchronously (`.catch()` so it never fails the HTTP response). Inside `notificationService.js`, the `qrcode` npm package generates a PNG buffer encoding the booking ID. That buffer is embedded as a `cid:` inline attachment in a styled HTML email sent via Nodemailer/Gmail. The customer sees the QR code directly in the email body — no download needed.

---

**Q6. What is the role of React Context in the frontend?**

> `BookingContext` manages all booking state globally — fetching bookings on load, creating new ones with optimistic local saves + background server sync, removing bookings, and exposing `getUpcomingBookings()` / `getPastBookings()` helpers. This avoids prop-drilling booking data through many component layers.

---

**Q7. How did you implement rate limiting and why?**

> I used `express-rate-limit` — max 100 requests per IP per 15 minutes, applied globally before all routes. It returns a `429` with a clear message when exceeded. This protects against brute-force attacks on auth routes and general API abuse.

---

**Q8. How does JWT authentication work in this project?**

> On login the server signs a JWT with `_id` and `email` using `JWT_SECRET` from env vars. The client stores this and sends it as `Bearer <token>` in the `Authorization` header on protected requests. The `auth` middleware verifies and decodes it, attaching the user to `req.user`. The `admin` middleware then checks `req.user.isAdmin` for admin-only routes.

---

**Q9. What advanced MongoDB features did you use?**

> - **Atomic updates with arrayFilters** — seat locking on nested 2D seatGrid arrays
> - **Aggregation pipeline** — dashboard stats (`$match isPaid` → `$group $sum amount`)
> - **`$inc` operator** — awarding loyalty points atomically without race conditions
> - **Populate** — resolving Movie ObjectId references in Booking documents
> - **`paymentIntentId`** — used as an idempotency key to prevent duplicate bookings

---

**Q10. Explain the split payment feature.**

> A user books seats and invites friends to split the cost. The booking is created with `status: pending` and a `splitPayment` object holding each friend's share and a 15-minute `expiresAt`. Each friend gets an email invite with a pay link. When they hit `POST /split/:id/pay`, their `isPaid` flag flips. When ALL have paid, the booking becomes `confirmed` and the primary user gets a QR ticket email.

---

**Q11. How did you structure the Express application?**

> Routes → HTTP handlers; Models → Mongoose schemas; Services → business logic (seat locking, notifications); Middleware → auth, rate limiting; Config → DB connection. Socket.IO runs on the same HTTP server. The `io` instance is attached to `req.io` via middleware so route handlers can emit real-time events without importing `io` directly.

---

**Q12. What security measures are in the project?**

> **Helmet.js** (HTTP security headers), **JWT auth** (stateless signed tokens), **CORS whitelist** (specific origins + Vercel subdomains regex), **rate limiting** (100/15min), **secrets in env vars** (never hardcoded, `.env` git-ignored), **Docker** (`RUN rm -f .env` ensures secrets never bake into the image).

---

## 🔁 Section 2 — GitHub Actions CI/CD (Q13–Q22)

**Q13. Describe your CI/CD pipeline architecture.**

> Four jobs in `.github/workflows/ci.yml`:
> 1. `backend-test` — Jest tests in `./server`
> 2. `frontend-test` — ESLint + Vitest in `./client`
> 3. `docker-build` — `needs: [backend-test, frontend-test]`; builds and pushes Docker images to Docker Hub
> 4. `deploy` — `needs: docker-build`; SSHs into EC2 and runs `docker compose pull && up -d`
>
> A failed test immediately stops everything — nothing deploys.

---

**Q14. Why tag Docker images with both `latest` and the git SHA?**

> `latest` is convenient for always pulling the newest image. The SHA tag (`${{ github.sha }}`) is an immutable traceable reference — you can roll back to any exact commit. If production breaks, you instantly know which commit the running image came from.

---

**Q15. Why do only `push` events trigger deployment, not pull requests?**

> Both `push` and `pull_request` trigger test jobs. But `docker-build` and `deploy` have `if: github.event_name == 'push'` — so they only run on direct pushes (merged PRs). PRs are tested but never deployed, preventing feature branches from hitting production.

---

**Q16. What are GitHub Actions secrets and how did you use them?**

> Encrypted env vars stored in repo settings, never visible in logs. I use: `DOCKER_USERNAME`/`DOCKER_PASSWORD` (image push), `EC2_IP`/`SSH_PRIVATE_KEY` (SSH deploy), `MONGODB_URI`/`JWT_SECRET` (injected into EC2 `.env` via `printf` at deploy time).

---

**Q17. Why `npm ci` instead of `npm install` in CI?**

> `npm ci` installs exactly what's in `package-lock.json`, never updates it, and fails on mismatch — guaranteeing reproducible installs. `npm install` can silently update packages and produce different dependency trees across runs.

---

**Q18. How does dependency caching work in your pipeline?**

> `actions/setup-node` with `cache: 'npm'` and `cache-dependency-path` pointing to the lockfile. If `package-lock.json` hasn't changed since the last run, the `node_modules` cache is restored and `npm ci` completes in seconds instead of minutes.

---

**Q19. How do you ensure environment parity between CI and production?**

> By building and testing inside the same Docker images that get deployed. The `docker-build` job builds from the same `Dockerfile` used in production. The deploy job pulls those exact images. The artifact tested in CI is byte-for-byte identical to what runs in production.

---

**Q20. What happens if the EC2 instance is unreachable during deploy?**

> `appleboy/ssh-action` times out and the job fails. GitHub marks the run as failed. The previous containers on EC2 keep running — `docker compose up -d` was never called so there's no downtime. Only the deploy didn't happen.

---

**Q21. How would you add a staging environment?**

> Add a `staging` branch with a second deploy job: `if: github.ref == 'refs/heads/staging'`, SSHing to a separate EC2 with its own `STAGING_EC2_IP` secret and staging-specific `.env`. The `main` deploy stays unchanged. PRs → staging, merges to main → production.

---

**Q22. What is a rolling deployment and does your pipeline do one?**

> A rolling deployment gradually replaces old instances with new ones, maintaining uptime. My pipeline does a simple `docker compose up -d --remove-orphans` which stops old containers and starts new ones — a brief downtime window exists. True rolling deployments need Kubernetes or ECS with multiple replicas. Acceptable for a single-instance portfolio project, but a known limitation.

---

## 🐳 Section 3 — Docker & Containerization (Q23–Q32)

**Q23. What is Docker and why did you containerize this project?**

> Docker packages an app and all dependencies into an isolated container that runs identically anywhere. Containerizing eliminated "works on my machine" issues — the same image runs on my laptop, in CI, and on AWS EC2 with different Node.js environments.

---

**Q24. Walk me through your server Dockerfile.**

> ```dockerfile
> FROM node:20-alpine       # Minimal base
> WORKDIR /app
> COPY package*.json ./     # Lockfile first — enables layer caching
> RUN npm ci                # Cached if lockfile unchanged
> COPY . .                  # Source code
> RUN rm -f .env            # Strip secrets — never bake into image
> EXPOSE 5000
> HEALTHCHECK ...           # Docker monitors container health
> CMD ["node", "index.js"]
> ```

---

**Q25. What is Docker layer caching and why does it matter?**

> Docker caches each instruction as a layer and only rebuilds from the first changed layer onwards. By copying `package*.json` before `COPY . .`, application code changes don't invalidate the `npm ci` layer. Rebuilds take seconds instead of minutes.

---

**Q26. What does the HEALTHCHECK instruction do?**

> Tells Docker to periodically test container health via `wget -q --spider http://localhost:5000/api/health` every 30 seconds. If it fails 3 times, the container is marked `unhealthy`. Orchestrators use this signal to automatically restart unhealthy containers.

---

**Q27. What services does your docker-compose.yml define?**

> 6 services: `server` (Node.js API), `tunnel` (Cloudflare HTTPS tunnel), `prometheus` (metrics collection), `grafana` (dashboards), `node-exporter` (host OS metrics), `cadvisor` (per-container metrics). All share a `lankan-net` bridge network for DNS-based service discovery.

---

**Q28. What is a Docker network and why use a named one?**

> A bridge network creates an isolated virtual network on the host. Named networks (`lankan-net`) enable DNS-based discovery — `prometheus` can reach `server:5000` by hostname. It also makes the architecture explicit and prevents containers from accidentally talking across unrelated stacks.

---

**Q29. What is .dockerignore and why is it important?**

> Like `.gitignore` but for the Docker build context. Excludes `node_modules`, `.env`, and logs. Without it Docker copies all of those into the build context — making builds slow, images large, and potentially leaking secrets into the image.

---

**Q30. What is the difference between CMD and ENTRYPOINT?**

> `CMD` provides default arguments overridable at `docker run` time. `ENTRYPOINT` sets a fixed executable that always runs; CMD provides its default arguments. I use `CMD ["node", "index.js"]` — suitable for a single-purpose container that can still be overridden for debugging.

---

**Q31. What does the Cloudflare Tunnel service do?**

> `cloudflared` creates an outbound tunnel from inside the container to Cloudflare's edge, exposing the API over HTTPS without opening inbound port 443 on the EC2 security group. Traffic flows: User → Cloudflare → tunnel → server. Configured via `TUNNEL_TOKEN` in `.env`.

---

**Q32. What is the difference between an image and a container?**

> An image is a read-only layered filesystem snapshot built from a Dockerfile. A container is a running instance of an image with an added writable layer. Multiple containers can run from the same image simultaneously. The writable layer is discarded when the container stops unless a volume is used.

---

## 🌍 Section 4 — Terraform & AWS Infrastructure (Q33–Q40)

**Q33. What is Infrastructure as Code and why Terraform?**

> IaC means defining cloud infrastructure in version-controlled code files. Terraform is declarative — I describe the desired state and Terraform computes what to create/update/destroy. This eliminated manual AWS Console clicks, reduced provisioning time ~70%, and made environments fully reproducible across dev/staging/prod.

---

**Q34. What AWS resources does your Terraform provision?**

> 1. `aws_security_group` — inbound on ports 22, 80, 3000, 5000, 9090, 3001; all outbound open
> 2. `aws_instance` — Ubuntu 22.04 `t3.micro` with `user_data` bootstrap that installs Docker and starts the full stack
> 3. `aws_eip` — Elastic IP so the public IP stays constant across reboots

---

**Q35. What is `user_data` and how did you use it?**

> A shell script that runs once on first EC2 boot. I used it to: install Docker, create directory structure, write `prometheus.yml`, `alerts.yml`, Grafana provisioning files, and `docker-compose.yml`, then run `docker compose up -d`. A fresh `terraform apply` produces a fully running app with zero manual steps.

---

**Q36. What is `terraform plan` and why is it important?**

> Shows a diff of what Terraform will create/update/destroy — without making any changes. Like a dry run. Critical for reviewing infrastructure changes before applying — prevents accidental deletions like `aws_instance will be destroyed`.

---

**Q37. What is Terraform state and what problem does local state cause?**

> State maps your config to real cloud resources. Local state (`terraform.tfstate`) on your machine gets corrupted if the file is lost or two people run Terraform simultaneously. The solution is a remote S3 backend with DynamoDB state locking — I've added a commented example in `main.tf`.

---

**Q38. How did you handle sensitive Terraform variables?**

> Declared with `sensitive = true` in `variables.tf` (e.g., `mongodb_uri`, `jwt_secret`) — Terraform redacts them from CLI output and plan logs. Real values are in `terraform.tfvars` which is git-ignored. Only `terraform.tfvars.example` (with placeholder values) is committed.

---

**Q39. What is an Elastic IP and why did you use one?**

> A static public IP that doesn't change across EC2 reboots. Without it, the instance gets a new IP every restart — breaking the `EC2_IP` GitHub secret, DNS records, and Cloudflare tunnel config. The EIP costs nothing while the instance is running.

---

**Q40. How would you add a staging environment in Terraform?**

> Use Terraform workspaces (`terraform workspace new staging`) or separate state files via different `terraform.tfvars` per environment. Extract shared resources into a `modules/` directory. Each workspace provisions its own EC2 + EIP + security group with environment-specific variables.

---

## 📊 Section 5 — Prometheus, Grafana & Observability (Q41–Q50)

**Q41. What is observability and what are its three pillars?**

> Observability is the ability to understand a system's internal state from its external outputs. Three pillars:
> - **Metrics** — numeric time-series (request rate, CPU%) → Prometheus
> - **Logs** — timestamped event records → console/CloudWatch
> - **Traces** — end-to-end request journeys → OpenTelemetry/Jaeger (not yet implemented)

---

**Q42. How does Prometheus collect metrics from your API?**

> `express-prom-bundle` middleware automatically instruments every Express route and exposes a `/metrics` endpoint in Prometheus text format. Prometheus scrapes `server:5000/metrics` every 15 seconds (pull model). It records `http_requests_total` (counter by method/path/status) and `http_request_duration_seconds` (histogram for latency percentiles) plus default Node.js metrics via `prom-client`.

---

**Q43. What is the difference between a counter, gauge, and histogram?**

> - **Counter** — only goes up (total requests, total errors). Use `rate()` for per-second rate.
> - **Gauge** — goes up and down (current active connections, memory right now).
> - **Histogram** — buckets observations (request durations). Enables `histogram_quantile(0.95, ...)` for p95 latency.

---

**Q44. Explain one of your Prometheus alert rules in detail.**

> `HighAPIErrorRate`:
> ```yaml
> expr: (sum(rate(http_requests_total{status=~"5.."}[5m]))
>        / sum(rate(http_requests_total[5m]))) * 100 > 5
> for: 2m
> ```
> Calculates the percentage of 5xx responses over 5 minutes. If above 5% for 2 consecutive minutes, the alert fires. The `for: 2m` prevents false positives from transient spikes. In production this routes to Alertmanager → Slack/PagerDuty.

---

**Q45. What is the difference between pull-based and push-based metrics?**

> Prometheus **pulls** — it scrapes `/metrics` endpoints on schedule. Services don't need to know about Prometheus. Push-based systems (StatsD, InfluxDB) have services actively send data to a collector. Pull is better for service discovery and health checking; push is better for short-lived batch jobs (use Prometheus Pushgateway for those).

---

**Q46. What does node-exporter do and why did you add it?**

> Collects host-level OS metrics: CPU per core, memory (total/available/cached), disk I/O, filesystem usage, network traffic. Without it, Prometheus only sees application metrics. With it, I can alert on "disk 80% full" or "CPU at 95%" — infrastructure problems the app itself can't report.

---

**Q47. What does cAdvisor do?**

> Runs as a container and exposes per-container resource metrics: CPU, memory limit vs. actual usage, network I/O, disk I/O — for every Docker container on the host. Lets me see "Grafana container uses 300MB RAM" vs "server container uses 150MB". Essential for capacity planning in containerized environments.

---

**Q48. What is Grafana provisioning and how did you use it?**

> Lets you define datasources and dashboards as YAML/JSON files instead of clicking through the UI. On startup Grafana reads `/etc/grafana/provisioning/`. I provision:
> - `datasources/prometheus.yml` — auto-configures Prometheus as default datasource
> - `dashboards/provider.yml` — tells Grafana to load JSON dashboards from a directory
>
> A fresh deployment has fully configured Grafana with zero manual setup.

---

**Q49. What is MTTD and how does your monitoring reduce it?**

> MTTD = Mean Time To Detect — how long to discover a problem after it starts. Without monitoring, you find out when a user complains (could be hours). With Prometheus alert rules firing within 1–5 minutes of threshold breaches, the team detects issues proactively. `APIInstanceDown` fires within 1 minute vs. potentially hours of silent failure.

---

**Q50. What would you add next to improve the observability stack?**

> 1. **Alertmanager** — route alerts to Slack/PagerDuty (alerts evaluate but aren't delivered anywhere yet)
> 2. **Distributed tracing** with OpenTelemetry — trace a booking request from React → API → MongoDB, find slow spans
> 3. **Loki** — ship container logs to Grafana's log storage so logs + metrics live in one place
> 4. **SLO dashboards** — define error budget (e.g., 99.5% uptime) and track burn rate
> 5. **Synthetic monitoring** — scheduled external uptime checks (Grafana Cloud / UptimeRobot)

---

> 💡 **Interview tip:** Reference specific files in every answer.
> Say *"in `showService.js`, the `lockSeat()` function uses atomic `findOneAndUpdate`..."*
> rather than speaking generically — it shows you actually built it
