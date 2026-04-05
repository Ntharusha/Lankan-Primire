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

  # Runs on first boot: installs Docker and starts your containers
  user_data = <<-EOF
    #!/bin/bash
    set -e
    apt-get update -y
    apt-get install -y docker.io
    systemctl enable --now docker
    usermod -aG docker ubuntu

    # Create a network so frontend can talk to backend by name
    docker network create lankan-net || true

    # Pull images from Docker Hub
    docker pull ${var.dockerhub_username}/lankan-primire-server:latest
    docker pull ${var.dockerhub_username}/lankan-primire-client:latest

    # Run backend
    docker run -d --name server \
      --network lankan-net \
      -p 5000:5000 \
      -e MONGODB_URI="${var.mongodb_uri}" \
      -e JWT_SECRET="${var.jwt_secret}" \
      -e NODE_ENV=production \
      --restart unless-stopped \
      ${var.dockerhub_username}/lankan-primire-server:latest

    # Run frontend
    docker run -d --name client \
      --network lankan-net \
      -p 3000:80 \
      --restart unless-stopped \
      ${var.dockerhub_username}/lankan-primire-client:latest
  EOF

  tags = { Name = "lankan-primire-ec2" }
}

# ── Elastic IP — keeps IP stable across reboots ──────────────────────
resource "aws_eip" "app_eip" {
  instance = aws_instance.app.id
  domain   = "vpc"
  tags     = { Name = "lankan-primire-eip" }
}
