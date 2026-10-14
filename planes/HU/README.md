# Planes de Implementación de Historias de Usuario (Programador 1)

Este directorio contiene las especificaciones técnicas completas de arquitectura, contratos de API, componentes UI, criterios BDD y checklists paso a paso para ejecutar las historias de usuario asignadas al **Programador 1** para la **Fase 1 (MVP)** y la **Fase 2 (Integración y Cierre)**.

---

## 📋 Catálogo de Planes de Implementación

### Fase 1: MVP (Track "Admin & Onboarding") — Completada ✅
| Historia | Título | Requerimientos | Story Points | Estado | Plan Detallado |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **US-01** | Acceso de Administrador con Credenciales Propias | `RF-02`, `RF-18` | 3 SP | ✅ Implementada | [Ver Plan Técnico US-01](US-01-acceso-administrador.md) |
| **US-04** | Importación y Validación de Estudiantes vía Excel | `RF-11`, `RN-02`, `RF-18` | 5 SP | ✅ Implementada | [Ver Plan Técnico US-04](US-04-importacion-estudiantes-excel.md) |
| **US-05** | Importación de Fechas y Horarios de Clase vía Excel | `RF-12`, `RF-18` | 5 SP | ✅ Implementada | [Ver Plan Técnico US-05](US-05-importacion-fechas-horarios-excel.md) |
| **US-06** | Vista Previa de Datos antes de Activar Módulo | `RF-16`, `RF-18` | 3 SP | ✅ Implementada | [Ver Plan Técnico US-06](US-06-vista-previa-modulo.md) |

* **Total Fase 1:** **16 Story Points** (Completada e integrada en `develop`).

---

### Fase 2: Integración y Cierre (Track Programador 1) — Completada ✅
*(Excluyendo US-13 de acuerdo con la asignación del usuario)*

| Historia | Título | Requerimientos | Story Points | Estado | Plan Detallado |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **US-07** | Activación de Nuevo Módulo con Archivado Histórico | `RF-13`, `RF-14`, `RF-15`, `RN-01`, `RN-08` | 5 SP | ✅ Implementada | [Ver Plan Técnico US-07](US-07-activacion-modulo-archivado.md) |
| **US-10** | Consulta y Búsqueda de Estudiantes Activos | `RF-06` | 3 SP | ✅ Implementada | [Ver Plan Técnico US-10](US-10-consulta-busqueda-estudiantes.md) |
| **US-03** | Cierre de Sesión y Control de Acceso por Roles (Guards) | `RF-02` | 2 SP | ✅ Implementada | [Ver Plan Técnico US-03](US-03-cierre-sesion-guards.md) |

* **Total Fase 2:** **10 Story Points** (Completada e integrada en `develop`).

---

## 🎯 Orden de Ejecución Recomendado para la Fase 2

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. US-07: Activación de Nuevo Módulo con Transacción ACID (5 SP)│
│    (Cierra el ciclo del Wizard conectando BD con US-04/US-05/06)│
└────────────────────────────────┬────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. US-10: Consulta y Búsqueda de Estudiantes Activos (3 SP)     │
│    (Consume los estudiantes matriculados en US-07 en /admin)    │
└────────────────────────────────┬────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. US-03: Cierre de Sesión y Guards Globales de Roles (2 SP)    │
│    (Blindaje final del middleware Next.js y guards de NestJS)   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌿 Convención de Ramas en Git para la Fase 2

1. **Rama base:** `develop`.
2. **Ramas de funcionalidad:**
   * `feature/US-07-module-activation-archive`
   * `feature/US-10-students-search-directory`
   * `feature/US-03-global-auth-guards-logout`
3. **Commits:** Seguir Conventional Commits (ej. `feat(modules): implementar activacion transaccional y archivado de modulo (US-07)`).

---

## 🛠️ Herramientas de Verificación Local

* **Swagger UI:** Cada nuevo endpoint debe documentarse con `@ApiTags('Auth' | 'Modules' | 'Students')`:
  👉 `http://localhost:3000/api/docs`
* **Base de datos:** Para pruebas locales de rollback o reinicio:
  ```bash
  cd backend
  npm run seed
  ```
