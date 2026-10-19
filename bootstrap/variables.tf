variable "aws_region" {
  description = "Region de AWS"
  type        = string
  default     = "us-east-2"
}

variable "bucket_name" {
  description = "Nombre globalmente unico para el bucket S3 del state"
  type        = string
  default     = "iac-asistencia-tfstate-006635110928-us-east-2"
}

variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para bloqueo de concurrencia de estado"
  type        = string
  default     = "iac-asistencia-tf-locks"
}
