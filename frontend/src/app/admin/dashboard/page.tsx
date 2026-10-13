'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/features/auth/services/auth.service';
import { AuthUser } from '@/features/auth/types/auth.types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
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
                Panel de Administración (US-01)
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
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Banner de Bienvenida */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-6 sm:p-8 shadow-lg shadow-indigo-600/10">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-3">
              Autenticación Exitosa • Token JWT Válido
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Bienvenido, {user?.username || 'Administrador'}
            </h1>
            <p className="mt-2 text-indigo-100 text-sm sm:text-base leading-relaxed">
              Has iniciado sesión con credenciales administrativas validadas en NestJS. Tu token JWT cuenta con rol de <strong className="font-semibold text-white">ADMIN</strong> y está listo para autorizar las operaciones de importación de estudiantes y calendario académico.
            </p>
          </div>
        </div>

        {/* Sección de historias de usuario asignadas a Fase 1 */}
        <div>
          <h2 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
            <span>🚀 Trayectoria de Implementación (Programador 1 - Fase 1)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* US-01 Card (Completada) */}
            <div className="rounded-xl bg-white dark:bg-zinc-900 border border-emerald-300 dark:border-emerald-800 p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  US-01 • IMPLEMENTADA
                </span>
                <span className="text-xs text-zinc-400">3 SP</span>
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base mb-1">
                Acceso de Administrador
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                Login con JWT, Guards, persistencia de sesión segura y manejo estandarizado de excepciones.
              </p>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sesión activa actual
              </div>
            </div>

            {/* US-04 Card */}
            <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600 transition">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                  US-04 • SIGUIENTE
                </span>
                <span className="text-xs text-zinc-400">5 SP</span>
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base mb-1">
                Importación de Estudiantes vía Excel
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                Carga masiva, validación de matrícula única, detección de duplicados y reporte de inconsistencias.
              </p>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                Listo para comenzar →
              </span>
            </div>

            {/* US-05 Card */}
            <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600 transition">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                  US-05 • PENDIENTE
                </span>
                <span className="text-xs text-zinc-400">5 SP</span>
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base mb-1">
                Importación de Horarios vía Excel
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                Configuración del calendario de clases del módulo, validación de franjas horarias y fechas válidas.
              </p>
              <span className="text-xs text-zinc-400 font-medium">
                En cola de tareas
              </span>
            </div>
          </div>
        </div>

        {/* Información Técnica de la Sesión */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <h2 className="text-base font-semibold mb-3">
            Detalles Técnicos de la Sesión Administrativa
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
              <span className="block text-xs text-zinc-500 mb-0.5">Identificador Único (ID)</span>
              <code className="text-xs font-mono font-semibold break-all">{user?.id || 'N/A'}</code>
            </div>
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
              <span className="block text-xs text-zinc-500 mb-0.5">Nombre de Usuario</span>
              <span className="font-semibold">{user?.username || 'N/A'}</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
              <span className="block text-xs text-zinc-500 mb-0.5">Correo Electrónico</span>
              <span className="font-semibold">{user?.email || 'N/A'}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
