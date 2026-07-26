# Lankan Premiere - Deployment Reference

This document provides reference links and details for the deployed production environment.

## 1. Frontend Client
* **Application URL:** [https://lankan-premire.vercel.app/](https://lankan-premire.vercel.app/)
* **Platform:** Vercel Global CDN (rewriting paths configured to route API calls securely)

## 2. Backend Application API
* **Base Endpoint:** `http://3.7.182.47:5000`
* **Health Check Endpoint:** [http://3.7.182.47:5000/api/health](http://3.7.182.47:5000/api/health)
* **Status Details:** Standard HTTP API health check. A `200 OK` response with `{"status":"ok"}` confirms that both the service and database connection are active.

## 3. Monitoring and Telemetry Stack
* **Grafana Dashboard:** [http://3.7.182.47:3001](http://3.7.182.47:3001)
  * *Standard Credentials:* `admin` / `admin`
* **Prometheus Metrics Page:** [http://3.7.182.47:9090](http://3.7.182.47:9090)

## 4. Managed Database
* **Database Instance:** MongoDB Atlas Managed Cluster
* **Access URL:** [https://cloud.mongodb.com/](https://cloud.mongodb.com/)
