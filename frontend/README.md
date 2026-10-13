# Frontend del Sistema de Asistencia

Aplicación web desarrollada con **Next.js** (App Router) y **Tailwind CSS** para la interfaz de usuario del Sistema de Asistencia Laboral.

---

## 🛠️ Stack Tecnológico

* **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19)
* **Lenguaje:** TypeScript
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
* **Iconografía & UI:** Diseño modular basado en componentes atómicos (`src/components/ui/`)

---

## 🏛️ Arquitectura del Software (App Router + Feature-Sliced)

La aplicación mantiene el directorio `src/app/` como una capa de enrutamiento delgada, delegando la lógica y vistas a módulos por característica dentro de `src/features/`:

```text
src/
├── app/                             # Capa de Enrutamiento (App Router)
│   ├── (auth)/                      # Rutas públicas (Login)
│   │   └── login/page.tsx
│   ├── (dashboard)/                 # Rutas privadas protegidas
│   │   ├── layout.tsx               # Shell del dashboard (Navbar, Sidebar)
│   │   ├── attendance/page.tsx      # Vista de marcaciones y asistencias
│   │   └── employees/page.tsx       # Vista de gestión de empleados
│   ├── error.tsx                    # Error boundary global
│   ├── loading.tsx                  # Loading skeleton global
│   └── layout.tsx                   # Root Layout con fuentes y proveedores
├── features/                        # Módulos de negocio (Features)
│   └── attendance/                  # Característica: Asistencias
│       ├── components/              # AttendanceTable.tsx, CheckInButton.tsx
│       ├── hooks/                   # useAttendance.ts, useCheckIn.ts
│       ├── services/                # attendance.service.ts (llamadas HTTP)
│       └── types/                   # attendance.types.ts
├── components/                      # Componentes reutilizables generales
│   ├── ui/                          # Componentes atómicos (Button, Input, Modal, Table, Badge)
│   └── layout/                      # Navbar, Sidebar, Footer
├── lib/                             # Clientes y utilidades
│   ├── api-client.ts                # Cliente HTTP que desempaqueta el sobre del backend
│   └── utils.ts                     # Utilidades (cn para Tailwind)
└── types/                           # Tipos globales (ApiResponse<T>, UserSession)
```

---

## 🌐 Conexión con el Backend

El frontend se comunica con el backend mediante un cliente tipado centralizado (`src/lib/api-client.ts`) que desempaqueta automáticamente las respuestas estandarizadas `{ status: 'success' | 'fail' | 'error' }`.

Para configurar la URL del backend, crea un archivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

---

## 🚀 Comandos de Ejecución

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar servidor de producción
npm run start

# Comprobación de linter
npm run lint
```

Por defecto, la aplicación estará disponible en: `http://localhost:3001` (o `http://localhost:3000`).