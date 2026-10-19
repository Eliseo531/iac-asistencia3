# ==========================================================
# Network Access Control List (NACL) - Subred Frontend
# ==========================================================
resource "aws_network_acl" "frontend_nacl" {
  vpc_id     = aws_vpc.main_vpc.id
  subnet_ids = [aws_subnet.frontend_subnet.id]

  # Ingress: Permitir HTTP (80)
  ingress {
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 80
    to_port    = 80
    protocol   = "tcp"
  }

  # Ingress: Permitir HTTPS (443)
  ingress {
    rule_no    = 110
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 443
    to_port    = 443
    protocol   = "tcp"
  }

  # Ingress: Permitir SSH (22)
  ingress {
    rule_no    = 120
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 22
    to_port    = 22
    protocol   = "tcp"
  }

  # Ingress: Puertos efimeros (1024-65535) requeridos por ser una regla sin estado (stateless)
  ingress {
    rule_no    = 130
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 1024
    to_port    = 65535
    protocol   = "tcp"
  }

  # Egress: Permitir todo el trafico de salida
  egress {
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
    protocol   = "-1"
  }

  tags = {
    Name    = "${var.project_name}-frontend-nacl"
    Project = var.project_name
  }
}

# ==========================================================
# Network Access Control List (NACL) - Subred Backend Aislada
# ==========================================================
resource "aws_network_acl" "backend_nacl" {
  vpc_id     = aws_vpc.main_vpc.id
  subnet_ids = [aws_subnet.backend_subnet.id]

  # Ingress: Permitir API NestJS (Puerto 3000) UNICAMENTE desde la subred del Frontend
  ingress {
    rule_no    = 100
    action     = "allow"
    cidr_block = var.public_subnet_cidr
    from_port  = 3000
    to_port    = 3000
    protocol   = "tcp"
  }

  # Ingress: Permitir SSH (Puerto 22) de salto desde la subred del Frontend
  ingress {
    rule_no    = 120
    action     = "allow"
    cidr_block = var.public_subnet_cidr
    from_port  = 22
    to_port    = 22
    protocol   = "tcp"
  }

  # Ingress opcional: Permitir SSH (Puerto 22) directo desde la IP del administrador si fue configurada
  dynamic "ingress" {
    for_each = var.admin_ssh_ip != null ? [var.admin_ssh_ip] : []
    content {
      rule_no    = 125
      action     = "allow"
      cidr_block = ingress.value
      from_port  = 22
      to_port    = 22
      protocol   = "tcp"
    }
  }

  # Ingress: Puertos efimeros para recibir respuestas cuando el backend descarga paquetes (apt, docker)
  ingress {
    rule_no    = 130
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 1024
    to_port    = 65535
    protocol   = "tcp"
  }

  # Egress: Permitir salida hacia internet (para paquetes) y respuesta a la subred del frontend
  egress {
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
    protocol   = "-1"
  }

  tags = {
    Name    = "${var.project_name}-backend-nacl"
    Project = var.project_name
  }
}
