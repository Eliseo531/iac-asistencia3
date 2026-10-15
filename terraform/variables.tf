variable "aws_region" {
  description = "Región de AWS donde se desplegarán los recursos"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Prefijo para los nombres y etiquetas de los recursos"
  type        = string
  default     = "iac-asistencia"
}

variable "instance_type" {
  description = "Tipo de instancia EC2 (t2.micro incluida en la capa gratuita - Free Tier)"
  type        = string
  default     = "t2.micro"
}

variable "key_name" {
  description = "Nombre opcional del Key Pair de AWS para conectarte por SSH (creado en la consola EC2 -> Key Pairs)"
  type        = string
  default     = null
}

variable "vpc_cidr" {
  description = "Bloque CIDR de la VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "Bloque CIDR de la Subred Pública (Servidor Frontend)"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  description = "Bloque CIDR de la Subred Privada/Aislada (Servidor Backend)"
  type        = string
  default     = "10.0.2.0/24"
}

variable "admin_ssh_ip" {
  description = "IP pública del administrador para acceso SSH de emergencia directo (formato CIDR, ej. 190.10.20.30/32). Si es null, el backend solo permite SSH vía Frontend (Bastion)"
  type        = string
  default     = null
}
