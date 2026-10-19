# ==========================================================
# Security Group para el Servidor Frontend (Next.js + Nginx)
# ==========================================================
resource "aws_security_group" "frontend_sg" {
  name        = "${var.project_name}-frontend-sg"
  description = "Reglas de firewall para el Frontend (Web y SSH publico)"
  vpc_id      = aws_vpc.main_vpc.id

  # Trafico Web HTTP (Puerto 80) publico
  ingress {
    description = "Acceso Web HTTP publico"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Trafico Web HTTPS (Puerto 443) publico
  ingress {
    description = "Acceso Web HTTPS publico"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Acceso administrativo por SSH (Puerto 22)
  ingress {
    description = "Acceso SSH para administracion"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Salida libre hacia internet y hacia la subred del backend
  egress {
    description = "Salida general para paquetes y conexion con backend"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "${var.project_name}-frontend-sg"
    Tier    = "Frontend"
    Project = var.project_name
  }
}

# ==========================================================
# Security Group para el Servidor Backend (NestJS + PostgreSQL)
# ==========================================================
resource "aws_security_group" "backend_sg" {
  name        = "${var.project_name}-backend-sg"
  description = "Reglas de firewall para el Backend (Acceso cerrado a Internet)"
  vpc_id      = aws_vpc.main_vpc.id

  # Puerto 3000 (API NestJS): ESTRICTAMENTE cerrado a internet.
  # UNICAMENTE permite conexiones provenientes del Security Group del Frontend.
  ingress {
    description     = "Acceso API NestJS EXCLUSIVO desde el Frontend"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.frontend_sg.id]
  }

  # Puerto 22 (SSH): Permitido como Bastion desde el Frontend
  ingress {
    description     = "Acceso SSH de salto (Bastion) desde el Frontend"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.frontend_sg.id]
  }

  # Regla opcional: Permitir SSH directo al backend solo si se especifico la IP del administrador
  dynamic "ingress" {
    for_each = var.admin_ssh_ip != null ? [var.admin_ssh_ip] : []
    content {
      description = "Acceso SSH de emergencia desde la IP fija del administrador"
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      cidr_blocks = [ingress.value]
    }
  }

  # Salida hacia internet para que el backend pueda descargar paquetes (apt, docker, npm)
  egress {
    description = "Salida a internet para descarga de paquetes y librerias"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "${var.project_name}-backend-sg"
    Tier    = "Backend-Restricted"
    Project = var.project_name
  }
}
