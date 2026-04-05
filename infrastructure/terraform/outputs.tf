output "ec2_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_eip.app_eip.public_ip
}

output "frontend_url" {
  description = "Frontend URL"
  value       = "http://${aws_eip.app_eip.public_ip}:3000"
}

output "backend_url" {
  description = "Backend API URL"
  value       = "http://${aws_eip.app_eip.public_ip}:5000/api"
}

output "ssh_command" {
  description = "SSH into your EC2 instance"
  value       = "ssh -i ${var.key_pair_name}.pem ubuntu@${aws_eip.app_eip.public_ip}"
}
