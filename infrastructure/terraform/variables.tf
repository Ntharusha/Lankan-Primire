variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1" # Mumbai — closest to Sri Lanka
}

variable "ec2_ami" {
  description = "Ubuntu 22.04 LTS AMI ID for ap-south-1"
  type        = string
  default     = "ami-0f58b397bc5c1f2e8"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro" # ✅ AWS Free Tier — 750 hrs/month for 12 months
}

variable "key_pair_name" {
  description = "Name of your EC2 key pair (for SSH)"
  type        = string
}

variable "dockerhub_username" {
  description = "Docker Hub username"
  type        = string
  default     = "ghost69"
}

variable "mongodb_uri" {
  description = "MongoDB Atlas connection URI"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret"
  type        = string
  sensitive   = true
}
