terraform {
  required_version = ">= 1.3"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ── Security Group ───────────────────────────────────────────────────
# Uses the default VPC — no VPC setup needed
resource "aws_security_group" "app_sg" {
  name        = "lankan-primire-sg"
  description = "Allow HTTP, SSH and app ports"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_ip]
  }
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "Backend API"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "Frontend"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "Prometheus"
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "Grafana"
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "lankan-primire-sg" }
}

# ── EC2 Instance ─────────────────────────────────────────────────────
resource "aws_instance" "app" {
  ami                         = var.ec2_ami
  instance_type               = var.instance_type
  key_name                    = var.key_pair_name
  vpc_security_group_ids      = [aws_security_group.app_sg.id]
  associate_public_ip_address = true
  user_data_replace_on_change = true

  # Runs on first boot: installs Docker and starts your containers
  user_data = <<-EOF
    #!/bin/bash
    
    # Robust apt-get installation
    for i in {1..5}; do
      apt-get update -y && apt-get install -y docker.io curl && break || sleep 10
    done
    
    systemctl enable --now docker

    # Install Docker Compose
    mkdir -p /usr/local/lib/docker/cli-plugins/
    curl -SL https://github.com/docker/compose/releases/download/v2.26.1/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

    # Wait for Docker to be ready
    while ! docker info > /dev/null 2>&1; do
      sleep 2
    done

    # Setup App Directory
    mkdir -p /home/ubuntu/app/prometheus
    mkdir -p /home/ubuntu/app/grafana/provisioning/datasources
    mkdir -p /home/ubuntu/app/grafana/provisioning/dashboards
    chown -R ubuntu:ubuntu /home/ubuntu/app

    # Prometheus Config
    cat <<'PROMETHEUS_EOF' > /home/ubuntu/app/prometheus/prometheus.yml
global:
  scrape_interval: 15s
scrape_configs:
  - job_name: 'api'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['server:5000']
PROMETHEUS_EOF

    # Grafana Datasource
    cat <<'DATASOURCE_EOF' > /home/ubuntu/app/grafana/provisioning/datasources/prometheus.yml
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    url: http://prometheus:9090
    access: proxy
    isDefault: true
DATASOURCE_EOF

    # Grafana Dashboard Provider
    cat <<'DASHBOARD_PROV_EOF' > /home/ubuntu/app/grafana/provisioning/dashboards/providers.yml
apiVersion: 1
providers:
  - name: 'Lankan Premiere'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    options:
      path: /etc/grafana/provisioning/dashboards
DASHBOARD_PROV_EOF

    # Grafana Dashboard JSON
    cat <<'DASHBOARD_JSON_EOF' > /home/ubuntu/app/grafana/provisioning/dashboards/express-dashboard.json
{
  "annotations": { "list": [ { "builtIn": 1, "datasource": "-- Grafana --", "enable": true, "hide": true, "iconColor": "rgba(0, 211, 255, 1)", "name": "Annotations & Alerts", "type": "dashboard" } ] },
  "editable": true, "id": null, "schemaVersion": 39, "title": "Express API Metrics", "uid": "express-metrics", "version": 1
}
DASHBOARD_JSON_EOF

    # Docker Compose File
    cat <<COMPOSE_EOF > /home/ubuntu/app/docker-compose.yml
services:
  server:
    image: ${var.dockerhub_username}/lankan-primire-server:latest
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI="${var.mongodb_uri}"
      - JWT_SECRET="${var.jwt_secret}"
      - NODE_ENV=production

  client:
    image: ${var.dockerhub_username}/lankan-primire-client:latest
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      - server

  prometheus:
    image: quay.io/prometheus/prometheus:latest
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:10.4.2
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - ./grafana/provisioning:/etc/grafana/provisioning
    depends_on:
      - prometheus
COMPOSE_EOF

    # Start the stack
    cd /home/ubuntu/app
    docker compose up -d
  EOF

  tags = { Name = "lankan-primire-ec2" }
}

# ── Elastic IP — keeps IP stable across reboots ──────────────────────
resource "aws_eip" "app_eip" {
  instance = aws_instance.app.id
  domain   = "vpc"
  tags     = { Name = "lankan-primire-eip" }
}
