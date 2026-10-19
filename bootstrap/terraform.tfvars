# ==============================================================================
# Variables de entorno para el Bootstrap (S3 Remote State + DynamoDB Lock)
# ==============================================================================

# Region de AWS donde se crearan el Bucket S3 y la tabla DynamoDB
aws_region = "us-east-2"

# Nombre globalmente unico para el bucket S3 (debe ser unico en todo AWS)
bucket_name = "iac-asistencia-tfstate-006635110928-us-east-2"

# Nombre de la tabla DynamoDB para el bloqueo concurrente de estado
dynamodb_table_name = "iac-asistencia-tf-locks"
