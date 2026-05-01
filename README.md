# Lankan Primire

Welcome to the **Lankan Primire** repository! 🎬 This is a full-stack movie digital ticketing application designed to provide a seamless cinema booking experience. 

This README outlines the **Application Features**, **API Architecture**, and **DevOps/CI/CD pipeline** behind the project.

---

## ✨ Features
- **Movie Catalog & Scheduling**: Browse currently airing and upcoming movies, view details, trailers, and scheduled showtimes.
- **Real-Time Seat Reservation**: Interactive theater layout with live seat locking via WebSockets to prevent double-bookings.
- **Secure Payment Gateway**: End-to-end secure ticketing transactions utilizing Stripe.
- **Digital Ticketing**: Scannable QR code generation for digital ticket validation at the cinema.
- **User Reviews & Ratings**: Allow users to share community feedback and rate movies.
- **Robust Security**: Rate limiting, Helmet HTTP headers, JWT authentication, and secure Docker-based deployment.

---

## 🏗️ Technology Stack
- **Frontend**: React, Vite, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express.js, Socket.IO
- **Database**: MongoDB (Atlas)
- **Infrastructure & Cloud**: AWS (EC2, Elastic IP), Terraform
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **Observability**: Prometheus & Grafana (WIP)

---

## 🧩 System Architecture

```mermaid
graph TB
    subgraph Client["🖥️ Frontend - React/Vite"]
        UI[React UI<br/>TailwindCSS + Framer Motion]
        CTX[Context API<br/>Auth / Booking / Favourites]
        SVC[Service Layer<br/>Axios + Socket.IO Client]
    end

    subgraph Server["⚙️ Backend - Node.js/Express"]
        MW[Middleware<br/>Helmet / CORS / Rate Limit / JWT Auth]
        API[REST API Routes<br/>/movies /shows /bookings<br/>/payments /users /reviews]
        WS[Socket.IO Server<br/>Real-time Seat Locking]
        BL[Business Logic<br/>Dynamic Pricing / Notifications]
    end

    subgraph Data["💾 Data Layer"]
        DB[(MongoDB Atlas)]
    end

    subgraph Infra["☁️ Infrastructure"]
        EC2[AWS EC2]
        TF[Terraform IaC]
        DOCKER[Docker Compose]
    end

    subgraph Monitoring["📊 Observability"]
        PROM[Prometheus]
        GRAF[Grafana]
    end

    UI --> CTX --> SVC
    SVC -- "HTTP /api/*" --> MW --> API --> DB
    SVC -- "WebSocket" --> WS --> DB
    API --> BL --> DB
    EC2 --> DOCKER
    TF --> EC2
    PROM -- "Scrape Metrics" --> Server
    GRAF -- "Visualize" --> PROM

    style Client fill:#1a1a2e,stroke:#e94560,color:#fff
    style Server fill:#0f3460,stroke:#e94560,color:#fff
    style Data fill:#16213e,stroke:#0f3460,color:#fff
    style Infra fill:#1a1a2e,stroke:#533483,color:#fff
    style Monitoring fill:#16213e,stroke:#533483,color:#fff
```

---

## 📂 Project Structure

```text
lankan-primire/
├── .github/workflows/     # CI/CD pipelines (GitHub Actions)
├── client/                # React/Vite Frontend Application
│   ├── public/            # Static client assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # View pages (Home, Movie, Booking, etc.)
│   │   ├── services/      # Backend API communication triggers
│   │   ├── context/       # React Context state management
│   │   └── hooks/         # Custom React hooks
│   ├── package.json       # Client dependencies
│   └── Dockerfile         # Client container build instructions
├── infrastructure/        # Infrastructure as code
│   └── terraform/         # Terraform configurations targeting AWS
├── server/                # Node.js/Express Backend Application
│   ├── models/            # Mongoose schemas (Movie, Booking, Show, User)
│   ├── routes/            # Express REST route controllers
│   ├── services/          # Heavy business logic and WebSocket management
│   ├── middleware/        # Custom Express middleware (e.g. auth validation)
│   ├── package.json       # Server dependencies
│   └── Dockerfile         # Server container build instructions
├── docker-compose.yml     # Local multi-container setup (DB, Client, Server)
└── README.md              # Project documentation (You are here!)
```

---

## 🔌 API Architecture & How It Works

The backend provides a RESTful JSON API alongside a real-time WebSocket connection to handle high-concurrency tasks like seat selection.

### Core REST Endpoints
The Express server exposes the following main resource endpoints routed through `/api/*`:
- `GET/POST /api/movies`: Fetch movie catalogs, individual movie details, or add new movies.
- `GET/POST /api/shows`: Retrieve theater schedules, screening dates, and time slots.
- `GET/POST /api/bookings`: View user booking history, create new booking records, and manage seat reservations.
- `POST /api/payments`: Communicates securely with the Stripe API to generate Payment Intents and confirm transactions.
- `GET/POST /api/users`: Handle user profiles, Clerk authentication webhooks, and preferences.
- `GET/POST /api/reviews`: Submit text reviews and star ratings, or fetch community reviews for a specific movie.
- `GET /api/health`: Provides a diagnostic check of the server and database connection status.

```mermaid
graph LR
    subgraph Client["Client App"]
        R[React Frontend]
    end

    subgraph Gateway["Express Server"]
        RL[Rate Limiter]
        HM[Helmet]
        CORS_MW[CORS]
        AUTH[JWT Auth Middleware]
    end

    subgraph Routes["API Routes"]
        M["/api/movies"]
        S["/api/shows"]
        B["/api/bookings"]
        P["/api/payments"]
        U["/api/users"]
        RV["/api/reviews"]
        H["/api/health"]
    end

    subgraph DB["MongoDB Atlas"]
        Movies[(Movies)]
        Shows[(Shows)]
        Bookings[(Bookings)]
        Users[(Users)]
        Reviews[(Reviews)]
    end

    R --> RL --> HM --> CORS_MW
    CORS_MW --> AUTH
    AUTH --> M & S & B & P & U & RV
    CORS_MW --> H
    M --> Movies
    S --> Shows
    B --> Bookings
    P --> Bookings
    U --> Users
    RV --> Reviews

    style Client fill:#e94560,stroke:#1a1a2e,color:#fff
    style Gateway fill:#0f3460,stroke:#1a1a2e,color:#fff
    style Routes fill:#16213e,stroke:#0f3460,color:#fff
    style DB fill:#1a1a2e,stroke:#533483,color:#fff
```

### Real-Time Socket.IO Logic
Because multiple users might try to book the same prime seat simultaneously, we use **Socket.IO** for live synchronization:
- `join_show`: Groups users viewing the same screening into a specific Socket room.
- `lock_seat`: When a user clicks a seat, an event is emitted to instantly gray it out for everyone else viewing that show. This prevents race conditions.
- `unlock_seat`: If a user changes their mind or their session expires, the seat is released back to the general pool for other users.
- **Auto-Cleanup**: A cron-style background interval sweeps the database every 2 minutes to forcefully release any seats locked by inactive users who abandoned their session.

```mermaid
sequenceDiagram
    participant U1 as User A
    participant U2 as User B
    participant SIO as Socket.IO Server
    participant DB as MongoDB

    Note over U1,U2: Both users viewing the same show

    U1->>SIO: join_show(showId)
    U2->>SIO: join_show(showId)
    SIO-->>U1: Connected to room
    SIO-->>U2: Connected to room

    U1->>SIO: lock_seat({showId, seatNumber: "A5", userId})
    SIO->>DB: Atomic update - lock seat A5
    DB-->>SIO: Lock confirmed
    SIO-->>U2: seat_locked({showId, seatNumber: "A5"})
    Note over U2: Seat A5 grayed out in UI

    U2->>SIO: lock_seat({showId, seatNumber: "A5", userId})
    SIO->>DB: Atomic update attempt
    DB-->>SIO: Already locked!
    SIO-->>U2: error("Seat is currently locked")

    U1->>SIO: unlock_seat({showId, seatNumber: "A5"})
    SIO->>DB: Release lock on A5
    SIO-->>U2: seat_unlocked({showId, seatNumber: "A5"})
    Note over U2: Seat A5 available again

    Note over SIO,DB: Every 2 minutes: Auto-cleanup expired locks (>10 min)
```

---

## ⚙️ DevOps Pipeline & Architecture

This project adopts a modern infrastructure-as-code and automated CI/CD approach, allowing for reliable and highly available zero-touch deployments.

```mermaid
graph LR
    subgraph SCM["Source Control"]
        GH[GitHub Repository]
    end

    subgraph CI["Continuous Integration"]
        GA[GitHub Actions]
        BT[Backend Tests<br/>Jest]
        FT[Frontend Tests<br/>Vitest + ESLint]
    end

    subgraph Build["Containerization"]
        DB_BUILD[Docker Buildx]
        DH[Docker Hub Registry]
    end

    subgraph IaC["Infrastructure as Code"]
        TF[Terraform]
        SG[Security Groups]
        EC2[AWS EC2 Instance]
        EIP[Elastic IP]
    end

    subgraph Deploy["Deployment"]
        SSH[SSH Action]
        DC[Docker Compose]
        APP["Running Containers<br/>Client + Server + Prometheus + Grafana"]
    end

    subgraph CDN["Frontend CDN"]
        VCL[Vercel Edge Network]
    end

    GH -- "Push / PR" --> GA
    GA --> BT & FT
    BT & FT -- "Pass" --> DB_BUILD
    DB_BUILD -- "Push Images" --> DH
    TF --> SG & EC2 & EIP
    DH -- "Pull Images" --> SSH
    SSH -- "Deploy via SSH" --> EC2
    EC2 --> DC --> APP
    GH -- "Auto Deploy" --> VCL

    style SCM fill:#1a1a2e,stroke:#e94560,color:#fff
    style CI fill:#16213e,stroke:#e94560,color:#fff
    style Build fill:#0f3460,stroke:#533483,color:#fff
    style IaC fill:#1a1a2e,stroke:#533483,color:#fff
    style Deploy fill:#16213e,stroke:#0f3460,color:#fff
    style CDN fill:#0f3460,stroke:#e94560,color:#fff
```

### 1. Source Control & Continuous Integration (CI)
Our pipeline uses **GitHub Actions** (`.github/workflows/ci.yml`) to govern code quality. When code is pushed or a PR is opened against the `main` branch:
- **Backend Tests**: Configures Node.js, installs server dependencies (`npm ci`), and runs the backend test suite using Jest.
- **Frontend Tests & Linting**: Installs client dependencies, enforces strict formatting guidelines (`npm run lint`), and executes Vitest for UI components.

### 2. Containerization (Docker)
Both the client and server applications are containerized using **Docker**:
- During a deployment to `main`, the CI workflow builds Docker images using `docker buildx`.
- Caching is configured through Docker registry caches to significantly speed up build times.
- Immutable images are tagged with both `latest` and a unique `github.sha` to enable safe rollbacks, and then pushed to **Docker Hub**.

```mermaid
graph TB
    subgraph ServerContainer["Server Container"]
        direction TB
        S_BASE["node:20-alpine"]
        S_DEPS["npm ci (production deps)"]
        S_SRC["Copy source code"]
        S_HEALTH["Healthcheck: /api/health"]
        S_CMD["CMD: node index.js"]
        S_BASE --> S_DEPS --> S_SRC --> S_HEALTH --> S_CMD
    end

    subgraph ClientContainer["Client Container (Multi-stage)"]
        direction TB
        C_BUILD["Stage 1: node:20-alpine<br/>npm ci + vite build"]
        C_NGINX["Stage 2: nginx:alpine<br/>Serve /dist"]
        C_PROXY["Proxy /api → server:5000"]
        C_BUILD --> C_NGINX --> C_PROXY
    end

    subgraph Compose["Docker Compose Stack"]
        SRV[Server :5000]
        CLT[Client :3000→80]
        PRO[Prometheus :9090]
        GRA[Grafana :3001→3000]
        NEX[Node Exporter :9100]
        CAD[cAdvisor :8080]
    end

    ServerContainer -.-> SRV
    ClientContainer -.-> CLT
    CLT --> SRV
    PRO --> SRV & NEX & CAD
    GRA --> PRO

    style ServerContainer fill:#0f3460,stroke:#e94560,color:#fff
    style ClientContainer fill:#16213e,stroke:#e94560,color:#fff
    style Compose fill:#1a1a2e,stroke:#533483,color:#fff
```

### 3. Infrastructure as Code (Terraform)
Hardware provision is declarative, managed via **Terraform** (`infrastructure/terraform/main.tf`).
- **VPC & Security**: Provisions a tight Security Group restricting to essential ports: SSH (22), HTTP (80 - Client), and App Ports (5000/3000).
- **Compute**: Deploys a free-tier eligible AWS EC2 Instance.
- **Network**: An AWS Elastic IP is attached to the instance ensuring a stable public IP across reboots or redeployments.
- **Bootstrap Script (User Data)**: Automatically installs Docker on instance boot, creates a custom `lankan-net` Docker network bridge, and initializes the environment.

### 4. Continuous Deployment (CD)
If the CI phase passes successfully, GitHub Actions orchestrates the application update directly on AWS EC2 without any downtime:
- Authorizes with the EC2 instance using an SSH Deploy Key (`appleboy/ssh-action`).
- Safely halts and removes existing `client` and `server` containers.
- Pulls the newest lightweight built images from Docker Hub.
- Leverages Docker run configurations with proper environment variable seeding (e.g., `MONGODB_URI`, `JWT_SECRET`).
- Evaluates container health for stability and automatically prunes old unused images to save block storage space.

### 5. Frontend Deployment (Vercel)
For the best performance and developer experience, the React frontend can be deployed directly on **Vercel**:
- **Automatic Builds**: Vercel detects the `client/` directory and `vite` framework automatically via the root `vercel.json`.
- **Environment Variables**: Configure `VITE_API_URL` and `VITE_API_BASE_URL` in the Vercel dashboard to point to your backend (e.g., your AWS EC2 IP).
- **Global Edge Network**: Ensures the UI is delivered instantly to users worldwide.

---

## 💻 Local Development Setup

We utilize `docker-compose` to replicate our production architecture locally. 

### Prerequisites:
- Docker and Docker Compose installed.
- Setup a `.env` file in the `./server` folder including your `MONGODB_URI` and `JWT_SECRET`.

### Getting Started:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/lankan-primire.git
   ```

2. Boot the cluster:
   ```bash
   docker-compose up --build
   ```

This spins up:
- The backend Node API on `http://localhost:5000`
- The frontend React UI on `http://localhost:3000`
- An isolated MongoDB container database locally on port `27017`

---

## 🔒 Secrets Management
To duplicate the automated deployment pipeline on your own GitHub fork, ensure the following Repository Secrets are populated in the GitHub repository's specific settings:
- `DOCKER_USERNAME`: Your Docker Hub identity.
- `DOCKER_PASSWORD`: Your Docker Hub Access Token.
- `SSH_PRIVATE_KEY`: Your SSH key pairing with the deployed EC2 metadata for Github Action handshakes.
- `EC2_IP`: The public Elastic IP deployed by Terraform.
- `EC2_USER`: Generally `ubuntu` for AWS EC2 instances.
- `MONGODB_URI`: Production Atlas cluster connection string.
- `JWT_SECRET`: Safe encryption key for JWT.

---

## 🎫 Booking Flow

The end-to-end user journey from browsing movies to receiving a digital ticket:

```mermaid
flowchart TD
    A["🏠 Browse Movies"] --> B["🎬 Select Movie"]
    B --> C["📅 Choose Showtime"]
    C --> D["💺 Select Seats"]
    D --> E{"Seats Available?"}
    E -- No --> F["❌ Seat locked by another user"]
    F --> D
    E -- Yes --> G["🔒 Seats locked via WebSocket"]
    G --> H{"Split Payment?"}
    H -- Yes --> I["👥 Invite friends to split"]
    I --> J["⏳ Wait for all payments (15 min)"]
    J --> K{"All Paid?"}
    K -- No --> L["❌ Booking expired"]
    K -- Yes --> M["✅ Booking Confirmed"]
    H -- No --> N["💳 Pay via Stripe"]
    N --> O{"Payment Success?"}
    O -- No --> P["❌ Payment Failed"]
    O -- Yes --> M
    M --> Q["📱 QR Code Generated"]
    Q --> R["📧 WhatsApp Notification"]
    R --> S["🎟️ Show QR at Cinema"]

    style A fill:#1a1a2e,stroke:#e94560,color:#fff
    style M fill:#0f3460,stroke:#00b894,color:#fff
    style Q fill:#16213e,stroke:#00b894,color:#fff
    style S fill:#0f3460,stroke:#00b894,color:#fff
    style F fill:#e94560,stroke:#1a1a2e,color:#fff
    style L fill:#e94560,stroke:#1a1a2e,color:#fff
    style P fill:#e94560,stroke:#1a1a2e,color:#fff
```

---

## 📊 Database Schema

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string role "user | admin"
        boolean isActive
        int loyaltyPoints
    }

    MOVIE {
        ObjectId _id PK
        string externalId
        string title
        string titleSinhala
        string titleTamil
        string overview
        string poster_path
        float vote_average
        int runtime
        boolean isShowing
        string[] moodTags
    }

    SHOW {
        ObjectId _id PK
        ObjectId movie FK
        ObjectId theater FK
        date dateTime
        int basePrice
        int currentPrice
        json seatGrid "2D array of seats"
    }

    THEATER {
        ObjectId _id PK
        string name
        string location
        string city
        string[] amenities
    }

    BOOKING {
        ObjectId _id PK
        json user "name, email, phone"
        ObjectId show_movie FK
        string[] bookedSeats
        int amount
        boolean isPaid
        string status "pending | confirmed | cancelled"
        string paymentIntentId
        json splitPayment
    }

    REVIEW {
        ObjectId _id PK
        ObjectId movie FK
        ObjectId user FK
        string userName
        int rating "1-5"
        string comment
    }

    USER ||--o{ BOOKING : "makes"
    USER ||--o{ REVIEW : "writes"
    MOVIE ||--o{ SHOW : "screened in"
    MOVIE ||--o{ REVIEW : "has"
    THEATER ||--o{ SHOW : "hosts"
    SHOW ||--o{ BOOKING : "booked for"
```
