output "frontend_public_ip" {
  description = "Direccion IP publica del Servidor Frontend (Next.js + Nginx)"
  value       = aws_instance.frontend_server.public_ip
}

output "frontend_private_ip" {
  description = "Direccion IP privada del Servidor Frontend dentro de la VPC"
  value       = aws_instance.frontend_server.private_ip
}

output "backend_private_ip" {
  description = "Direccion IP privada del Servidor Backend (NestJS + PostgreSQL) - Usar esta IP en la configuracion de Nginx"
  value       = aws_instance.backend_server.private_ip
}

output "backend_public_ip" {
  description = "Direccion IP publica de salida del Backend (el trafico entrante esta 100% bloqueado por el Security Group)"
  value       = aws_instance.backend_server.public_ip
}

output "frontend_web_url" {
  description = "URL publica para abrir el frontend en tu navegador"
  value       = "http://${aws_instance.frontend_server.public_ip}"
}

output "ssh_connect_frontend" {
  description = "Comando para conectar por SSH directamente al servidor Frontend"
  value       = var.key_name != null ? "ssh -i <tu-clave.pem> ubuntu@${aws_instance.frontend_server.public_ip}" : "Configura 'key_name' para conectarte por SSH"
}

output "ssh_connect_backend_bastion" {
  description = "Comando para conectar por SSH al Backend usando el Frontend como salto (Bastion)"
  value       = var.key_name != null ? "ssh -i <tu-clave.pem> -J ubuntu@${aws_instance.frontend_server.public_ip} ubuntu@${aws_instance.backend_server.private_ip}" : "Configura 'key_name' para conectarte por SSH"
}
