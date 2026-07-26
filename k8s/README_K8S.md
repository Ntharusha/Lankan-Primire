# ☸️ Kubernetes Deployment Guide - Lankan Primire

This directory contains production-ready **Kubernetes (K8s)** manifests to orchestrate the multi-service **Lankan Primire** application stack.

---

## 🏗️ Architecture Overview

The Kubernetes deployment includes:
* **Namespace**: `lankan-primire` (resource isolation)
* **Backend Deployment**: 2 Replicas with Liveness & Readiness health probes
* **Frontend Deployment**: 2 Replicas serving static assets via Nginx
* **Horizontal Pod Autoscaler (HPA)**: Auto-scales backend from 2 to 10 pods based on CPU/Memory load
* **Ingress Controller**: Path-based routing for `/api`, `/socket.io` (WebSockets), and `/` (UI)
* **Secrets & ConfigMaps**: Decoupled environment configuration and sensitive credentials

---

## 🚀 Deployment Instructions

### Prerequisites
* `kubectl` CLI installed
* Running Kubernetes cluster (Minikube, K3s, Kind, or AWS EKS)

### 1. Create Namespace & Secrets
```bash
# Create isolated namespace
kubectl apply -f k8s/namespace.yaml

# Apply configuration map
kubectl apply -f k8s/configmap.yaml

# Copy and edit secret values
cp k8s/secret.yaml.example k8s/secret.yaml
kubectl apply -f k8s/secret.yaml
```

### 2. Deploy Services & Applications
```bash
# Deploy Backend API Stack
kubectl apply -f k8s/backend-deployment.yaml

# Deploy Frontend React UI Stack
kubectl apply -f k8s/frontend-deployment.yaml

# Apply Ingress & HPA
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml
```

### 3. Verify Deployment
```bash
# Check running pods
kubectl get pods -n lankan-primire

# Check services
kubectl get svc -n lankan-primire

# View autoscaler status
kubectl get hpa -n lankan-primire
```
