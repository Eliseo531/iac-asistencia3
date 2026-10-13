# API del Sistema de Asistencia (Backend)

API RESTful desarrollada con **NestJS** y **TypeORM** para el control y registro de asistencia laboral, gestión de empleados, turnos y reportes.

---

## 🛠️ Stack Tecnológico

* **Framework:** [NestJS](https://nestjs.com/) (TypeScript en modo estricto)
* **ORM:** [TypeORM](https://typeorm.io/)
* **Validación:** `class-validator` y `class-transformer`
* **Pruebas:** Jest

---

## 🏛️ Arquitectura del Software (Feature-Driven)

El proyecto sigue una arquitectura modular donde cada característica de negocio está completamente aislada en su propia carpeta:

```text
src/
├── common/                          # Capa transversal compartida
│   ├── entities/                    # Entidad base abstracta (AppBaseEntity)
│   ├── exceptions/                  # Excepción base (AppBusinessException) y códigos
│   ├── filters/                     # GlobalExceptionFilter (manejo unificado fail/error)
│   ├── interceptors/                # TransformResponseInterceptor (encapsulado success)
│   ├── pipes/                       # Validación global de DTOs
│   ├── guards/                      # Guards de seguridad y autorización
│   └── decorators/                  # Decoradores personalizados (@CurrentUser)
├── config/                          # Configuración de base de datos y entorno
└── features/                        # Módulos de negocio (Features)
    ├── attendance/                  # Marcaciones y cálculo de horas
    │   ├── dto/                     # create-attendance.dto.ts, etc.
    │   ├── entities/                # attendance.entity.ts
    │   ├── exceptions/              # Excepciones de negocio de la feature
    │   ├── attendance.controller.ts # Rutas HTTP y validación
    │   ├── attendance.service.ts    # Lógica de negocio y persistencia
    │   └── attendance.module.ts
    ├── employees/                   # Gestión de personal
    ├── shifts/                      # Turnos y horarios
    └── auth/                        # Autenticación y permisos
```

---

## 📦 Estándar de Respuestas HTTP (JSend Extendido)

Todas las respuestas de la API están estandarizadas:

1. **`success` (HTTP 2xx):**
   ```json
   {
     "status": "success",
     "message": "Operación completada exitosamente",
     "data": { ... }
   }
   ```
2. **`fail` (HTTP 4xx - Errores de Validación o Dominio):**
   ```json
   {
     "status": "fail",
     "code": "EMPLOYEE_NOT_FOUND",
     "message": "No se encontró el empleado solicitado",
     "data": { "id": "..." }
   }
   ```
3. **`error` (HTTP 5xx - Errores No Controlados de Servidor):**
   ```json
   {
     "status": "error",
     "code": "INTERNAL_SERVER_ERROR",
     "message": "Ha ocurrido un error interno en el servidor",
     "data": null
   }
   ```

---

## 🚀 Comandos de Ejecución

```bash
# Instalar dependencias
npm install

# Modo desarrollo con recarga en vivo (hot-reload)
npm run start:dev

# Compilar para producción
npm run build

# Iniciar compilado de producción
npm run start:prod

# Ejecutar pruebas unitarias
npm run test
```

Por defecto, la API estará disponible en: `http://localhost:3000/api/v1`