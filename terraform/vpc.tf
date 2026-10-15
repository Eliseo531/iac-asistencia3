# VPC Aislada para el Proyecto de Asistencia
resource "aws_vpc" "main_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name    = "${var.project_name}-vpc"
    Project = var.project_name
  }
}

# Internet Gateway para permitir la salida y entrada controlada a la VPC
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main_vpc.id

  tags = {
    Name    = "${var.project_name}-igw"
    Project = var.project_name
  }
}

# Subred Pública: Alojamiento del Servidor Frontend (Next.js + Nginx)
resource "aws_subnet" "frontend_subnet" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name    = "${var.project_name}-public-subnet"
    Tier    = "Frontend"
    Project = var.project_name
  }
}

# Subred Aislada: Alojamiento del Servidor Backend (NestJS + PostgreSQL)
# Se asocia a la tabla de ruteo para permitir salida a internet (egress para apt/docker)
# sin incurrir en el costo de un NAT Gateway (~$32/mes).
# La seguridad de entrada (ingress) está 100% garantizada por el Security Group y la NACL.
resource "aws_subnet" "backend_subnet" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = var.private_subnet_cidr
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name    = "${var.project_name}-backend-subnet"
    Tier    = "Backend-Restricted"
    Project = var.project_name
  }
}

# Tabla de Enrutamiento hacia Internet Gateway
resource "aws_route_table" "app_route_table" {
  vpc_id = aws_vpc.main_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name    = "${var.project_name}-route-table"
    Project = var.project_name
  }
}

# Asociación de la Subred Frontend a la Tabla de Enrutamiento
resource "aws_route_table_association" "frontend_association" {
  subnet_id      = aws_subnet.frontend_subnet.id
  route_table_id = aws_route_table.app_route_table.id
}

# Asociación de la Subred Backend a la Tabla de Enrutamiento
resource "aws_route_table_association" "backend_association" {
  subnet_id      = aws_subnet.backend_subnet.id
  route_table_id = aws_route_table.app_route_table.id
}
