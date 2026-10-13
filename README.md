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