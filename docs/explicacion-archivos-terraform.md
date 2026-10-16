# 🏗️ Explicación de los Archivos de Infraestructura con Terraform

Este documento detalla la estructura, propósito técnico y configuraciones implementadas en cada uno de los archivos de Terraform para el sistema **IaC Asistencia**. La infraestructura está diseñada bajo el principio de **Defensa en Profundidad (*Defense in Depth*)** y optimizada al 100% para la **Capa Gratuita de AWS (*Free Tier*)**.

---

## 🗂️ Estructura del Directorio `terraform/`

```text
terraform/
├── main.tf                    # Definición de proveedores e instancias EC2 (Cómputo)
├── vpc.tf                     # Red virtual, subredes, tabla de rutas e Internet Gateway
├── security_groups.tf         # Reglas de firewall con estado (Stateful)
├── nacl.tf                    # Listas de control de acceso a nivel de subred (Stateless)
├── variables.tf               # Parámetros de entrada configurables
├── outputs.tf                 # Valores de salida (IPs, URLs y comandos SSH)
└── terraform.tfvars.example   # Plantilla de variables para personalizar el entorno
```

---

## 📄 1. `main.tf` - Proveedores e Instancias de Cómputo

Define los proveedores requeridos, la configuración de la región y el aprovisionamiento de los servidores virtuales (EC2).

### Componentes Clave:
* **Bloque `terraform` y `required_providers`:**
  * Fija la versión mínima requerida de Terraform (`>= 1.5.0`) y descarga el proveedor oficial de AWS (`hashicorp/aws ~> 5.0`).
* **Proveedor de AWS (`provider "aws"`):**
  * Lee la región configurada (`var.aws_region`, por defecto `us-east-2`). Las credenciales de acceso se leen de forma segura desde las variables de entorno o la sesión activa del AWS CLI.
* **Servidor Frontend (`aws_instance.frontend_server`):**
  * Hospeda la aplicación Next.js y el proxy inverso Nginx.
  * **Tipo de instancia:** `t3.micro` (2 vCPUs, elegible para Free Tier en `us-east-2`).
  * **Ubicación:** Subred Pública (`aws_subnet.frontend_subnet`).
  * **Almacenamiento:** Disco EBS de 14 GB con volumen de alto rendimiento `gp3` y destrucción automática al terminar (`delete_on_termination = true`).
  * **Memoria Swap (2 GB):** Configurada en `user_data` mediante script idempotente para evitar bloqueos por falta de memoria RAM (*Out of Memory*) durante la compilación o ejecución.
* **Servidor Backend (`aws_instance.backend_server`):**
  * Hospeda la API NestJS y el contenedor de base de datos PostgreSQL.
  * **Tipo de instancia:** `t3.micro`.
  * **Ubicación:** Subred Restringida / Aislada (`aws_subnet.backend_subnet`).
  * **Almacenamiento:** Disco EBS de 15 GB `gp3` (14 GB + 15 GB = 29 GB $\le$ límite de 30 GB de Free Tier).
  * **Memoria Swap (2 GB):** Configurada en `user_data` para garantizar estabilidad bajo concurrencia.
* **Manejo de AMI (`var.ami_id`):**
  * Se utiliza un ID estático de la AMI oficial de Ubuntu 22.04 LTS para evitar llamadas dinámicas a `ec2:DescribeImages` que suelen ser bloqueadas por políticas de control institucional (*Service Control Policies - SCP*).

---

## 🌐 2. `vpc.tf` - Red Virtual y Topología de Subredes

Construye la topología de red aislada dentro de AWS.

### Componentes Clave:
* **VPC Principal (`aws_vpc.main_vpc`):**
  * Espacio de red privado con bloque CIDR `10.0.0.0/16`.
  * Activa soporte de DNS y nombres de host DNS para permitir resolución de nombres interna.
* **Internet Gateway (`aws_internet_gateway.igw`):**
  * Puerta de enlace que permite la comunicación bidireccional entre la VPC e Internet.
* **Subred Pública Frontend (`aws_subnet.frontend_subnet`):**
  * Bloque CIDR `10.0.1.0/24`.
  * Asigna IP pública al iniciar (`map_public_ip_on_launch = true`) para recibir tráfico web en los puertos 80 y 443.
* **Subred Aislada Backend (`aws_subnet.backend_subnet`):**
  * Bloque CIDR `10.0.2.0/24`.
  * Diseñada para albergar la lógica de negocio y la base de datos sin exposición de servicios a internet.
* **Tabla de Ruteo y Asociaciones:**
  * Ruta por defecto `0.0.0.0/0` dirigida al Internet Gateway para permitir que el Backend descargue paquetes y librerías del sistema operativo (`apt`, `docker`, `npm`) sin incurrir en el costo de un NAT Gateway (~$32 USD/mes).
  * La protección perimetral del Backend queda garantizada por los Security Groups y las NACLs.

---

## 🛡️ 3. `security_groups.tf` - Cortafuegos a Nivel de Instancia (Stateful)

Controla el tráfico de red entrante y saliente directamente en la interfaz de red virtual (ENI) de cada servidor. Son cortafuegos con estado (*Stateful*).

### A. Grupo de Seguridad Frontend (`frontend_sg`):
* **Ingress (Entrada):**
  * Puerto `80` (HTTP): Abierto a `0.0.0.0/0` para acceso de usuarios.
  * Puerto `443` (HTTPS): Abierto a `0.0.0.0/0` para tráfico cifrado SSL/TLS.
  * Puerto `22` (SSH): Permitido para administración remota.
* **Egress (Salida):**
  * Tráfico saliente libre hacia cualquier destino (`0.0.0.0/0`).

### B. Grupo de Seguridad Backend (`backend_sg`):
* **Ingress (Entrada Estricta):**
  * Puerto `3000` (API NestJS): **Exclusivamente permitido desde el `frontend_sg`**. Internet global tiene prohibido el acceso directo a este puerto.
  * Puerto `22` (SSH de salto): **Exclusivamente permitido desde el `frontend_sg`**. El Frontend actúa como servidor Bastion (*Jump Host*).
  * Regla dinámica opcional (`dynamic "ingress"`): Permite SSH directo solo si se definió una IP de administración (`admin_ssh_ip`).
  * Puerto `5432` (PostgreSQL): **Cerrado a la red**. La base de datos corre en `localhost` dentro del servidor backend y no se expone al exterior.
* **Egress (Salida):**
  * Tráfico saliente libre para actualización de paquetes y contenedores.

---

## 🧱 4. `nacl.tf` - Listas de Control de Acceso a Nivel de Subred (Stateless)

Proporciona una segunda barrera defensiva en el perímetro de cada subred. A diferencia de los Security Groups, las NACLs no tienen estado (*Stateless*), por lo que requieren reglas explícitas tanto de ida como de vuelta (puertos efímeros).

### A. NACL Frontend (`frontend_nacl`):
* Regla 100: Permite HTTP (80) entrante desde `0.0.0.0/0`.
* Regla 110: Permite HTTPS (443) entrante desde `0.0.0.0/0`.
* Regla 120: Permite SSH (22) entrante desde `0.0.0.0/0`.
* Regla 130: Permite puertos efímeros (`1024-65535`) para el tráfico de retorno de peticiones salientes.
* Egress: Permite todo el tráfico de salida (`0.0.0.0/0`).

### B. NACL Backend (`backend_nacl`):
* Regla 100: Permite tráfico entrante en el puerto `3000` **únicamente desde la subred del Frontend** (`var.public_subnet_cidr`).
* Regla 120: Permite SSH (22) **únicamente desde la subred del Frontend**.
* Regla 125 (Dinámica): Permite SSH (22) desde la IP del administrador si está configurada.
* Regla 130: Permite puertos efímeros (`1024-65535`) para respuestas de descargas (`apt`, `npm`, Docker Hub).
* Regla 110 de PostgreSQL (5432): **Eliminada** por principio de mínimo privilegio.

---

## ⚙️ 5. `variables.tf` - Parámetros de Entrada

Permite parametrizar la infraestructura sin necesidad de modificar el código fuente:

| Variable | Tipo | Valor Predeterminado | Propósito |
| :--- | :--- | :--- | :--- |
| `aws_region` | `string` | `us-east-2` | Región geográfica de AWS donde se despliegan los recursos. |
| `project_name` | `string` | `iac-asistencia` | Prefijo unificado para nombres y etiquetas (*Tags*). |
| `instance_type` | `string` | `t3.micro` | Tamaño de servidor (2 vCPUs, apta para Free Tier en `us-east-2`). |
| `key_name` | `string` | `null` | Nombre del par de claves SSH registrado en AWS EC2. |
| `ami_id` | `string` | `ami-0d966c673c03a734a` | AMI oficial de Ubuntu 22.04 LTS en `us-east-2`. |
| `vpc_cidr` | `string` | `10.0.0.0/16` | Rango de direcciones IP para la red privada virtual. |
| `public_subnet_cidr` | `string` | `10.0.1.0/24` | Rango IP para la subred pública (Frontend). |
| `private_subnet_cidr` | `string` | `10.0.2.0/24` | Rango IP para la subred privada (Backend). |
| `admin_ssh_ip` | `string` | `null` | IP fija opcional del administrador en formato CIDR (`x.x.x.x/32`). |

---

## 📤 6. `outputs.tf` - Información de Salida y Operación

Al finalizar `terraform apply`, este archivo calcula y muestra los datos necesarios para operar la infraestructura:

* **`frontend_public_ip`:** Dirección IP pública para acceder al servidor web.
* **`frontend_private_ip`:** Dirección IP interna del servidor Frontend.
* **`backend_private_ip`:** Dirección IP privada del Backend (utilizada en la directiva `proxy_pass` de Nginx).
* **`backend_public_ip`:** IP pública del Backend (solo para salida a internet; el acceso entrante está cerrado).
* **`frontend_web_url`:** Enlace directo formateado para abrir la aplicación web en el navegador.
* **`ssh_connect_frontend`:** Comando completo listo para conectar por SSH al Frontend.
* **`ssh_connect_backend_bastion`:** Comando completo con salto (*Jump Host*) para conectar al Backend a través del Frontend.

---

## 📋 7. `terraform.tfvars.example` - Plantilla de Variables

Archivo de ejemplo que se copia como `terraform.tfvars` para personalizar valores locales (como el nombre de tu clave SSH o tu IP de administración). Este archivo y su versión real están excluidos del repositorio en `.gitignore` para no filtrar datos de sesión.
