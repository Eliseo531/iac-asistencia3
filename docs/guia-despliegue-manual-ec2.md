# 🚀 Guía de Despliegue Manual en AWS EC2 (Arquitectura 2-Tier)

Esta guía detalla paso a paso la instalación manual, configuración de dependencias, compilación, ejecución persistente y configuración de **Nginx como Reverse Proxy** para el sistema **IaC Asistencia** sobre la infraestructura de 2 servidores creada con Terraform.

---

## 📐 1. Arquitectura y Topología de Servidores

```mermaid
flowchart LR
    User([Usuario / Navegador]) -->|HTTP :80| Nginx[Nginx :80]
    
    subgraph FrontendServer ["Servidor Frontend (Subred Publica)"]
        Nginx -->|Proxy Pass :3001| NextJS["Next.js App :3001"]
        Nginx -->|Proxy Pass :3000 (Subred)| NestAPI
    end

    subgraph BackendServer ["Servidor Backend (Subred Aislada - Acceso Cerrado)"]
        NestAPI["NestJS API :3000"]
        NestAPI --> Postgres[("PostgreSQL :5432 (Docker)")]
    end

    User -.->|BLOQUEADO POR SG :3000| NestAPI
```

| Componente | Servidor | Red | Puertos Expuestos | Función |
| :--- | :--- | :--- | :--- | :--- |
| **Nginx** | Frontend | Pública | `80` (HTTP), `443` (HTTPS) | Puerta de entrada y proxy inverso |
| **Next.js** | Frontend | Localhost (`127.0.0.1`) | `3001` | Interfaz web de usuario |
| **NestJS API** | Backend | Subred Privada (`10.0.2.x`) | `3000` (Solo desde Frontend SG) | Lógica de negocio y autenticación |
| **PostgreSQL**| Backend | Localhost (`127.0.0.1`) | `5432` | Base de datos relacional persistente |

---

## 🔑 2. Conexión SSH a los Servidores

Para ejecutar estos pasos necesitas tu archivo de clave privada (`iac-asistencia.pem`) obtenido de la consola de AWS EC2 (región `us-east-2`).

> [!IMPORTANT]
> **Permisos de la Clave en Windows (Obligatorio):**  
> Si usas Windows, OpenSSH rechazará la clave por tener permisos heredados demasiado abiertos (*"UNPROTECTED PRIVATE KEY FILE"*). Antes de conectar, ejecuta en PowerShell para dar lectura exclusiva a tu usuario:
> ```powershell
> icacls.exe ".\iac-asistencia.pem" /reset
> icacls.exe ".\iac-asistencia.pem" /grant:r "$($env:USERNAME):(R)"
> icacls.exe ".\iac-asistencia.pem" /inheritance:r
> ```
> *(En Linux o macOS simplemente ejecutas: `chmod 400 iac-asistencia.pem`)*

### A. Conectar al Servidor Frontend (Público):
* **Desde PowerShell / Bash:**
  ```powershell
  ssh -i .\iac-asistencia.pem ubuntu@<IP_PUBLICA_FRONTEND>
  ```

### B. Conectar al Servidor Backend (Aislado vía Salto / Bastion):
Como el backend no permite SSH directo desde internet, usamos el Frontend como salto (*Jump Host*):
* **Opción recomendada en PowerShell (Windows):**
  ```powershell
  ssh -i .\iac-asistencia.pem -o "ProxyCommand=ssh -i .\iac-asistencia.pem -W %h:%p ubuntu@<IP_PUBLICA_FRONTEND>" ubuntu@<IP_PRIVADA_BACKEND>
  ```
* **Opción estándar en Linux / macOS / Git Bash (`-J`):**
  ```bash
  ssh -i ./iac-asistencia.pem -J ubuntu@<IP_PUBLICA_FRONTEND> ubuntu@<IP_PRIVADA_BACKEND>
  ```

---

## ⚙️ 3. Configuración del Servidor Backend (NestJS + PostgreSQL)

> Realiza estos pasos dentro del **Servidor Backend** (`10.0.2.x`).

### Paso 3.1: Actualizar el Sistema Operativo
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential ca-certificates gnupg
```

### Paso 3.2: Instalar Node.js 20 LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v # Debe mostrar v20.x
npm -v
```

### Paso 3.3: Instalar Docker y Docker Compose (Para la Base de Datos)
```bash
# Agregar la clave oficial de Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Agregar el repositorio
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Permitir usar docker sin sudo
sudo usermod -aG docker ubuntu
newgrp docker
```

### Paso 3.4: Clonar el Repositorio
```bash
cd ~
git clone -b fernando https://github.com/FernandoCossio/iac-asistencia.git
cd iac-asistencia
```

### Paso 3.5: Iniciar la Base de Datos PostgreSQL
Inicia el contenedor de PostgreSQL usando el `docker-compose.yml` del proyecto:
```bash
docker compose up -d postgres

# Esperar unos segundos a que PostgreSQL termine su inicialización interna:
for i in {1..30}; do
  if docker exec iac-asistencia-db pg_isready -U postgres >/dev/null 2>&1; then
    echo "✅ PostgreSQL está listo para recibir conexiones!"
    break
  fi
  sleep 2
done
```

### Paso 3.6: Configurar Variables de Entorno del Backend
```bash
cd ~/iac-asistencia/backend
cp .env.example .env
```
Edita el archivo `.env` con `nano .env` y verifica que contenga:
```ini
PORT=3000
NODE_ENV=production
FRONTEND_URL=*

# Base de datos local en el backend
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=asistencia_db
DB_SYNCHRONIZE=false

# Clave secreta para JWT
JWT_SECRET=super-secreto-asistencia-prod-2026
JWT_EXPIRATION=24h
```

### Paso 3.7: Instalar Dependencias, Semilla y Compilar
```bash
# Instalar dependencias
npm install

# Ejecutar el seed (crea las tablas e inserta admin y estudiantes iniciales)
npm run seed

# Compilar NestJS para producción
npm run build
```

### Paso 3.8: Ejecutar el Backend como Servicio Persistente con PM2
Instalamos **PM2** para que la aplicación corra en segundo plano y se reinicie automáticamente si el servidor se reinicia:
```bash
sudo npm install -g pm2

# Iniciar la API con PM2
pm2 start dist/main.js --name "asistencia-backend"

# Configurar persistencia al reiniciar el servidor
pm2 save
pm2 startup
# (Ejecuta el comando que pm2 startup te muestre en pantalla si te lo solicita)
```

### Paso 3.9: Verificar que la API responda localmente
```bash
curl http://localhost:3000/api/v1
```
*(Debe responder la API de NestJS correctamente).*

---

## 🌐 4. Configuración del Servidor Frontend (Next.js + Nginx)

> Realiza estos pasos dentro del **Servidor Frontend** (IP Pública).

### Paso 4.1: Actualizar el Sistema e Instalar Node.js y Nginx
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential nginx

# Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Paso 4.2: Clonar el Repositorio
```bash
cd ~
git clone -b fernando https://github.com/FernandoCossio/iac-asistencia.git
cd iac-asistencia/frontend
```

### Paso 4.3: Configurar Variables de Entorno de Next.js
> **Concepto Crucial:** Al usar Nginx como Reverse Proxy, el frontend se comunica con la API a través de la ruta `/api/v1`. Nginx se encargará de reenviar esas llamadas internamente a la IP privada del backend.

Crea o edita `.env.local`:
```bash
nano .env.local
```
Coloca exactamente:
```ini
NEXT_PUBLIC_API_URL=/api/v1
```

### Paso 4.4: Instalar Dependencias y Compilar Next.js
```bash
npm install
npm run build
```

### Paso 4.5: Ejecutar Next.js en Segundo Plano con PM2
```bash
sudo npm install -g pm2

# Iniciar Next.js en el puerto interno 3001
pm2 start npm --name "asistencia-frontend" -- start -- -p 3001

pm2 save
pm2 startup
```

Verifica que responda localmente en el puerto 3001:
```bash
curl http://localhost:3001
```

---

## 🔀 5. Configuración de Nginx como Reverse Proxy

Ahora configuraremos Nginx en el Servidor Frontend para que reciba las peticiones web en el puerto `80` y las distribuya:
* `/` $\rightarrow$ Al Next.js local en el puerto `3001`.
* `/api/` $\rightarrow$ A la IP privada del Backend en el puerto `3000`.

### Paso 5.1: Crear el Bloque de Servidor en Nginx
Puedes crearlo con `sudo nano /etc/nginx/sites-available/asistencia` o pegar directamente este comando automatizado con `sudo tee` (sustituyendo `<IP_PRIVADA_BACKEND>` por tu IP privada, ej. `10.0.2.216`):

```bash
cat << 'EOFNGINX' | sudo tee /etc/nginx/sites-available/asistencia > /dev/null
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    # Tamaño maximo de subida (util para plantillas Excel de asistencia)
    client_max_body_size 20M;

    # 1. Enrutar peticiones de la API hacia el Servidor Backend Privado
    location /api/ {
        proxy_pass http://<IP_PRIVADA_BACKEND>:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 2. Enrutar el resto de trafico hacia la aplicacion Next.js local
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOFNGINX
```

### Paso 5.2: Habilitar el Sitio y Reiniciar Nginx
```bash
# Deshabilitar el sitio por defecto de Nginx
sudo rm -f /etc/nginx/sites-enabled/default

# Habilitar la nueva configuracion
sudo ln -s /etc/nginx/sites-available/asistencia /etc/nginx/sites-enabled/

# Verificar la sintaxis de la configuracion
sudo nginx -t

# Reiniciar Nginx para aplicar cambios
sudo systemctl restart nginx
```

---

## 🛡️ 6. Pruebas de Verificación y Seguridad

### Prueba 1: Acceso Web Público Funcional
Abre tu navegador e ingresa a:
```text
http://<IP_PUBLICA_FRONTEND>
```
* Debe cargar la pantalla de Login del Sistema de Asistencia.
* Ingresa con las credenciales de semilla (Admin):
  * **Email:** `admin@sistema.com` (o `admin@uagrm.edu.bo`)
  * **Password:** `admin123`
* Al iniciar sesión, la interfaz debe comunicarse de forma transparente con la API privada a través de Nginx y mostrar los módulos y datos de asistencia.

### Prueba 2: Verificación de Aislamiento del Backend (Acceso Cerrado)
Desde tu propia computadora o terminal personal, intenta hacer una petición directa al puerto del Backend:
```bash
curl --max-time 5 http://<IP_PUBLICA_BACKEND>:3000/api/v1
```
* **Resultado Esperado:** La petición se queda esperando y da **Timeout** (*Connection timed out*).
* **Conclusión:** Queda demostrado que la API y la base de datos están 100% aisladas y protegidas por los Security Groups y la NACL de AWS.

---

## 🧹 7. Apagado Temporal o Destrucción de Recursos (Control de Costos)

Para no consumir horas innecesarias de la Capa Gratuita (750 horas mensuales de EC2):

### Opción A: Detener las Instancias (Recomendado para pausar y continuar después)
Si deseas pausar tu trabajo y retomarlo al día siguiente sin perder la base de datos ni las instalaciones:
1. En la consola de AWS EC2, selecciona ambas instancias (`iac-asistencia-frontend` y `iac-asistencia-backend`).
2. Ve a **Estado de la instancia** (*Instance state*) $\rightarrow$ **Detener instancia** (*Stop instance*).
3. Cuando vuelvas a encenderlas (*Start*), consulta la guía detallada:  
   👉 **[Guía de Re-levantamiento de Servidores EC2](guia-re-levantamiento-ec2.md)** para reconectar y verificar los servicios en pocos minutos.

### Opción B: Destrucción Total con Terraform (Al finalizar el módulo o entrega)
Si ya concluiste las evaluaciones y deseas eliminar permanentemente todos los recursos de AWS:

```powershell
cd terraform
terraform destroy -auto-approve
```

