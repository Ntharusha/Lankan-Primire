# Lankan Premiere - Production Links 🎬

Here are the official links to access all parts of your deployed infrastructure.

## 🎥 1. Frontend (Live Website)
This is the URL your users will visit to book movies.
* **Live App:** [https://lankan-premire.vercel.app/](https://lankan-premire.vercel.app/)

## ⚙️ 2. Backend API (AWS EC2)
This is your server handling databases, payments, and WebSockets.
* **Base URL:** `http://3.7.182.47:5000`
* **Health Check API:** [http://3.7.182.47:5000/api/health](http://3.7.182.47:5000/api/health)
*(If the health check returns `{"status":"ok"}`, the server is running perfectly!)*

## 📊 3. Monitoring & Analytics
Your AWS infrastructure health and performance dashboards.
* **Grafana Dashboard:** [http://3.7.182.47:3001](http://3.7.182.47:3001)
  * *Default Login:* `admin` / `admin`
* **Prometheus Metrics:** [http://3.7.182.47:9090](http://3.7.182.47:9090)

## 🗄️ 4. Cloud Database
Your centralized cloud database where all movies and bookings are permanently stored.
* **MongoDB Atlas:** [https://cloud.mongodb.com/](https://cloud.mongodb.com/)
