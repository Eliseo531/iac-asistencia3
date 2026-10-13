# IaC Asistencia

Proyecto academico compuesto por:
- **Frontend:** Next.js (App Router, TypeScript, Tailwind CSS)
- **Backend:** NestJS (TypeScript, Express)

---

## Estructura del Proyecto

```text
iac-asistencia/
├── frontend/        # Aplicacion Next.js
│   ├── src/app/     # Rutas y componentes (App Router)
│   └── package.json
├── backend/         # API NestJS
│   ├── src/         # Controladores, servicios y modulos
│   └── package.json
├── .gitignore
└── README.md
```

---

## Ejecucion Local

### 1. Backend (NestJS)
```bash
cd backend
npm run start:dev
```
Por defecto correra en: `http://localhost:3000`

### 2. Frontend (Next.js)
```bash
cd frontend
npm run dev
```
Por defecto correra en: `http://localhost:3001` (o `3000` si el backend no esta usando ese puerto).

---

## Vincular este repositorio a GitHub

Para publicar este proyecto de forma independiente en tu cuenta de GitHub:

1. Crea un nuevo repositorio vacio en GitHub (ej. `iac-asistencia`).
2. Ejecuta los siguientes comandos desde la carpeta `iac-asistencia`:
   ```bash
   git add .
   git commit -m "feat: inicializacion de frontend (Next.js) y backend (Nest.js)"
   git remote add origin https://github.com/TU_USUARIO/iac-asistencia.git
   git branch -M main
   git push -u origin main
   ```