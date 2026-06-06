terraform {
  required_version = ">= 1.3"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # ── Remote State Backend (recommended for team / production use) ──────────
  # Uncomment and configure before running `terraform init` in a shared environment.
  # This stores tfstate in S3 and uses DynamoDB for state locking.
  #
  # backend "s3" {
  #   bucket         = "lankan-primire-tfstate"   # Create this bucket first
  #   key            = "prod/terraform.tfstate"
  #   region         = "ap-south-1"
  #   encrypt        = true
  #   dynamodb_table = "lankan-primire-tf-lock"   # Create this table first
  # }
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

  # Runs on first boot: installs Docker and Git, then sets up app directory
  user_data = <<-EOF
    #!/bin/bash
    # Update and install dependencies
    apt-get update -y
    apt-get install -y curl git

    # Use official Docker convenience script
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh

    # Start and enable Docker
    systemctl enable --now docker

    # Wait for Docker to be ready
    while ! docker info > /dev/null 2>&1; do
      sleep 2
    done

    # Setup App Directory with proper permissions
    mkdir -p /home/ubuntu/app
    chown -R ubuntu:ubuntu /home/ubuntu/app
    chmod -R 755 /home/ubuntu/app
  EOF

  tags = { Name = "lankan-primire-ec2" }
}

# ── Elastic IP — keeps IP stable across reboots ──────────────────────
resource "aws_eip" "app_eip" {
  instance = aws_instance.app.id
  domain   = "vpc"
  tags     = { Name = "lankan-primire-eip" }
}

