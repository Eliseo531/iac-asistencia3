terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "iac-asistencia-tfstate-900670597917-us-east-1"
    key            = "asistencia/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "iac-asistencia-tf-locks"
    encrypt        = true
  }
}

# Proveedor de AWS (las credenciales se leen de las variables de entorno de la sesión)
provider "aws" {
  region = var.aws_region
}

# ==========================================================
# 1. Servidor Frontend (Next.js + Nginx) - Subred Publica
# ==========================================================
resource "aws_instance" "frontend_server" {
  ami                    = var.ami_id
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

  # Script base para configurar memoria Swap (2 GB) y preinstalar utilidades basicas
  user_data = <<-EOF
              #!/bin/bash
              set -e

              # 1. Configurar archivo Swap de 2 GB (previene OOM en instancias t2.micro con 1 GB RAM)
              if [ ! -f /swapfile ]; then
                fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
                chmod 600 /swapfile
                mkswap /swapfile
                swapon /swapfile
                echo '/swapfile none swap sw 0 0' >> /etc/fstab
                sysctl vm.swappiness=10
                echo 'vm.swappiness=10' >> /etc/sysctl.conf
              fi

              # 2. Actualizar repositorios e instalar paquetes base
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
  ami                    = var.ami_id
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

  # Script base para configurar memoria Swap (2 GB) y preinstalar utilidades basicas
  user_data = <<-EOF
              #!/bin/bash
              set -e

              # 1. Configurar archivo Swap de 2 GB (previene OOM en instancias t2.micro con 1 GB RAM)
              if [ ! -f /swapfile ]; then
                fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
                chmod 600 /swapfile
                mkswap /swapfile
                swapon /swapfile
                echo '/swapfile none swap sw 0 0' >> /etc/fstab
                sysctl vm.swappiness=10
                echo 'vm.swappiness=10' >> /etc/sysctl.conf
              fi

              # 2. Actualizar repositorios e instalar paquetes base
              apt-get update -y
              apt-get install -y ca-certificates curl gnupg git ufw
              EOF

  tags = {
    Name    = "${var.project_name}-backend-server"
    Tier    = "Backend-Restricted"
    Project = var.project_name
  }
}
