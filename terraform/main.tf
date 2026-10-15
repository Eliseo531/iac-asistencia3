terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Proveedor de AWS (las credenciales se leen de las variables de entorno de la sesión)
provider "aws" {
  region = var.aws_region
}

# Obtener automáticamente la última AMI oficial de Ubuntu 22.04 LTS (Apta para Free Tier)
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical ID

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# ==========================================================
# 1. Servidor Frontend (Next.js + Nginx) - Subred Publica
# ==========================================================
resource "aws_instance" "frontend_server" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.frontend_subnet.id
  vpc_security_group_ids = [aws_security_group.frontend_sg.id]
  key_name               = var.key_name

  # Almacenamiento EBS de 14 GB (dentro de los 30 GB totales de Free Tier)
  root_block_device {
    volume_size           = 14
    volume_type           = "gp3"
    delete_on_termination = true
  }

  # Script base para actualizar paquetes y preinstalar utilidades basicas
  user_data = <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y ca-certificates curl gnupg git ufw
              EOF

  tags = {
    Name    = "${var.project_name}-frontend-server"
    Tier    = "Frontend"
    Project = var.project_name
  }
}

# ==========================================================
# 2. Servidor Backend (NestJS + PostgreSQL) - Subred Aislada
# ==========================================================
resource "aws_instance" "backend_server" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.backend_subnet.id
  vpc_security_group_ids = [aws_security_group.backend_sg.id]
  key_name               = var.key_name

  # Almacenamiento EBS de 15 GB (14 GB + 15 GB = 29 GB <= 30 GB Free Tier)
  root_block_device {
    volume_size           = 15
    volume_type           = "gp3"
    delete_on_termination = true
  }

  # Script base para actualizar paquetes y preinstalar utilidades basicas
  user_data = <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y ca-certificates curl gnupg git ufw
              EOF

  tags = {
    Name    = "${var.project_name}-backend-server"
    Tier    = "Backend-Restricted"
    Project = var.project_name
  }
}
