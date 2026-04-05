# 🚀 Lankan Primire: Senior-Hardened Deployment Guide

This guide reflects the current **Senior Engineer Audit** upgrades, including SSH hardening and API rate limiting.

## 🏗️ Phase 1: Provisioning Infrastructure (Terraform)

### 1. Configure Variables
Create/Edit your `terraform.tfvars`:
```bash
key_pair_name      = "lankan"
allowed_ssh_ip     = "X.X.X.X/32" # Your public IP from 'curl ifconfig.me'
mongodb_uri        = "..."
jwt_secret         = "..."
dockerhub_username = "..."
```

### 2. Apply Changes
```bash
cd infrastructure/terraform
terraform apply
```

---

## 🛠️ Phase 2: Backend Protection (API)

Before pushing, ensure you have the rate-limiting package installed:
```bash
cd server
npm install express-rate-limit
```

---

## 🚀 Phase 3: Deployment (CI/CD)

1. **Verify Base64 Key**: `cat lankan.pem | base64 -w 0`
2. **Push Changes**:
    ```bash
    git add .
    git commit -m "chore: senior engineer audit upgrades"
    git push origin main
    ```

---

## 🔍 Phase 4: Verification

- **Frontend**: `http://<EC2_IP>:3000`
- **Backend Health**: `http://<EC2_IP>:5000/api/health`
- **Docker Health Status**: SSH into the box and run `docker ps` to see "healthy" status.
yifykfkufk