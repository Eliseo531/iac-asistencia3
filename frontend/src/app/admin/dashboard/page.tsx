'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/features/auth/services/auth.service';
import { AuthUser } from '@/features/auth/types/auth.types';
import { LogoutConfirmButton } from '@/features/auth/components/LogoutConfirmButton';
import { ModuleImportService } from '@/features/modules/services/module-import.service';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeModule, setActiveModule] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    const token = authService.getStoredToken();

    if (!token) {
      router.push('/admin/login');
      return;
    }

    setUser(storedUser);
    setIsLoading(false);

    // Cargar módulo activo desde la API
    ModuleImportService.getActiveModule(token).then((mod) => {
      if (mod) setActiveModule(mod);
    });
  }, [router]);

  const handleLogout = () => {
    authService.logoutAdmin();
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-zinc-500">Cargando sesión administrativa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Barra de navegación superior */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              A
            </div>
            <div>
              <span className="font-semibold text-base block leading-none">
                Sistema de Asistencia
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Panel de Administración • Rama develop
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium leading-none">
                {user?.username || 'Administrador'}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {user?.email || 'admin@sistema.com'}
              </span>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
              {user?.role || 'ADMIN'}
            </span>
            <LogoutConfirmButton role="ADMIN" />
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Banner de Bienvenida */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-6 sm:p-8 shadow-lg shadow-indigo-600/10">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                Autenticación Exitosa • Token JWT Válido
              </span>
              <span className="px-3 py-1 bg-emerald-400/25 border border-emerald-300/40 rounded-full text-xs font-semibold text-emerald-200">
                Fase 2 Iniciada • US-07 Activada
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Bienvenido, {user?.username || 'Administrador'}
            </h1>
            <p className="mt-2 text-indigo-100 text-sm sm:text-base leading-relaxed">
              Sistema de control de asistencia. La activación transaccional con preservación histórica (US-07) está implementada con integridad ACID sobre PostgreSQL.
            </p>
          </div>
        </div>

        {/* Módulo Activo Actual (RN-01, RN-08) */}
        {activeModule && (
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-800/60 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      Módulo Activo en Sistema (RN-01)
                    </span>
                    <span className="text-xs font-mono font-bold text-zinc-500">
                      {activeModule.code}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {activeModule.name}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                    <span>👥 Alumnos matriculados: <strong>{activeModule.students?.length ?? 0}</strong></span>
                    <span>📅 Sesiones de clase: <strong>{activeModule.schedules?.length ?? 0}</strong></span>
                    <span>⏳ Período: <strong>{activeModule.startDate}</strong> al <strong>{activeModule.endDate}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href="/admin/estudiantes"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Ver Directorio de Alumnos (US-10)</span>
                </Link>
                <Link
                  href="/admin/modulo/importar"
                  className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold rounded-xl transition-all"
                >
                  Reemplazar / Nuevo Ciclo
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Sección de Gestión y Acciones de Módulos (Acceso Principal) */}
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-indigo-100 dark:border-indigo-950/50 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                Operaciones Académicas
              </span>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Gestión y Configuración de Módulos
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Inicia el asistente para importar la nómina de estudiantes, calendario de clases y activar el módulo académico.
              </p>
            </div>

            <Link
              href="/admin/modulo/importar"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Configurar Nuevo Módulo (Asistente 3 Pasos)</span>
            </Link>
          </div>

          {/* Accesos directos a los pasos del asistente */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Link
              href="/admin/modulo/importar"
              className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-zinc-50/50 dark:bg-zinc-800/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 transition">
                  Paso 1: Estudiantes
                </h3>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Carga y validación masiva del archivo Excel de estudiantes (US-04).
              </p>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Abrir Paso 1 →
              </span>
            </Link>

            <Link
              href="/admin/modulo/importar/fechas"
              className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-zinc-50/50 dark:bg-zinc-800/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 transition">
                  Paso 2: Calendario
                </h3>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Importación y ordenamiento de fechas y horarios de clase (US-05).
              </p>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Abrir Paso 2 →
              </span>
            </Link>

            <Link
              href="/admin/modulo/preview"
              className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-zinc-50/50 dark:bg-zinc-800/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 transition">
                  Paso 3: Vista Previa y Activación
                </h3>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Revisión consolidada y activación con transacción ACID (US-06 / US-07).
              </p>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Abrir Paso 3 →
              </span>
            </Link>
          </div>
        </div>

        {/* Sección de historias de usuario del Programador 1 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <span>🚀 Historias de Usuario Implementadas (Prog. 1)</span>
            </h2>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              26 Story Points Completados
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
            {/* US-01 Card */}
            <div className="rounded-xl bg-white dark:bg-zinc-900 border border-emerald-300 dark:border-emerald-800 p-3.5 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    US-01 • FASE 1
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">3 SP</span>
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs mb-1">
                  Login Admin
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                  JWT, Guards, sesión.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                ✓ Implementada
              </div>
            </div>

            {/* US-04 Card */}
            <Link
              href="/admin/modulo/importar"
              className="rounded-xl bg-white dark:bg-zinc-900 border border-emerald-300 dark:border-emerald-800 p-3.5 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between group"
            >
              <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    US-04 • FASE 1
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">5 SP</span>
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs mb-1 group-hover:text-indigo-600 transition">
                  Excel Alumnos
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                  Parser y validación.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center justify-between">
                <span>Abrir</span>
                <span>→</span>
              </div>
            </Link>

            {/* US-05 Card */}
            <Link
              href="/admin/modulo/importar/fechas"
              className="rounded-xl bg-white dark:bg-zinc-900 border border-emerald-300 dark:border-emerald-800 p-3.5 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between group"
            >
              <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    US-05 • FASE 1
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">5 SP</span>
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs mb-1 group-hover:text-emerald-600 transition">
                  Excel Fechas
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                  Calendario y horas.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-between">
                <span>Abrir</span>
                <span>→</span>
              </div>
            </Link>

            {/* US-06 Card */}
            <Link
              href="/admin/modulo/preview"
              className="rounded-xl bg-white dark:bg-zinc-900 border border-emerald-300 dark:border-emerald-800 p-3.5 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between group"
            >
              <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    US-06 • FASE 1
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">3 SP</span>
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs mb-1 group-hover:text-blue-600 transition">
                  Vista Previa
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                  KPIs consolidados.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center justify-between">
                <span>Abrir</span>
                <span>→</span>
              </div>
            </Link>

            {/* US-07 Card */}
            <Link
              href="/admin/modulo/preview"
              className="rounded-xl bg-white dark:bg-zinc-900 border border-emerald-400 dark:border-emerald-700 p-3.5 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between group"
            >
              <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    US-07 • FASE 2
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">5 SP</span>
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs mb-1 group-hover:text-emerald-600 transition">
                  Activación ACID
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                  Transacción y archivo.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-between">
                <span>Ver Módulo</span>
                <span>→</span>
              </div>
            </Link>

            {/* US-10 Card */}
            <Link
              href="/admin/estudiantes"
              className="rounded-xl bg-white dark:bg-zinc-900 border border-emerald-400 dark:border-emerald-700 p-3.5 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between group"
            >
              <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    US-10 • FASE 2
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">3 SP</span>
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs mb-1 group-hover:text-indigo-600 transition">
                  Búsqueda Alumnos
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                  Nómina y debounce 300ms.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center justify-between">
                <span>Directorio</span>
                <span>→</span>
              </div>
            </Link>

            {/* US-03 Card */}
            <div className="rounded-xl bg-white dark:bg-zinc-900 border border-emerald-400 dark:border-emerald-700 p-3.5 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    US-03 • FASE 2
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">2 SP</span>
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs mb-1">
                  Guards & Logout
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                  Cierre seguro y RBAC.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-between">
                <span>✓ Blindaje</span>
                <span>✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Información Técnica del Entorno y Sesión */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <h2 className="text-base font-semibold mb-3">
            Detalles Técnicos de la Sesión y Entorno
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
              <span className="block text-xs text-zinc-500 mb-0.5">Rama Git Activa</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                feature/US-03-global-auth-guards-logout
              </span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
              <span className="block text-xs text-zinc-500 mb-0.5">Usuario Administrador</span>
              <span className="font-semibold">{user?.username || 'admin'}</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
              <span className="block text-xs text-zinc-500 mb-0.5">Correo Electrónico</span>
              <span className="font-semibold">{user?.email || 'admin@sistema.com'}</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
              <span className="block text-xs text-zinc-500 mb-0.5">API Backend</span>
              <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                http://localhost:3000/api/v1
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
