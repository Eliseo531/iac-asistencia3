'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStudentAuth } from '@/features/auth/hooks/useStudentAuth';
import { TodayClassCard } from '@/features/attendances/components/TodayClassCard';
import {
  GraduationCap,
  CalendarCheck,
  History,
  LogOut,
  Loader2,
  Sparkles,
} from 'lucide-react';

export default function AsistenciaPage() {
  const router = useRouter();
  const { student, isLoading, logout } = useStudentAuth();

  useEffect(() => {
    if (!isLoading && !student) {
      router.push('/login');
    }
  }, [isLoading, student, router]);

  if (isLoading || !student) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
          <span className="text-sm font-medium text-slate-500 dark:text-zinc-400">
            Cargando sesión del estudiante...
          </span>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col transition-colors">
      {/* Barra de navegación superior */}
      <header className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-30 shadow-sm transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-zinc-50 leading-tight">
                {student.fullName}
              </h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Registro: <strong className="text-slate-700 dark:text-zinc-300">{student.registrationNumber}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href="/asistencia"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-xs"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Marcación de Hoy</span>
            </Link>
            <Link
              href="/historial"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
            >
              <History className="w-4 h-4" />
              <span>Mi Historial</span>
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition ml-1 cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Control de Asistencia Diario</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
            Registro de Asistencia del Estudiante
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 max-w-md mx-auto">
            Presione el botón para registrar su asistencia en tiempo real durante la sesión de clase.
          </p>
        </div>

        <TodayClassCard
          moduleName={student.module?.name}
          moduleCode={student.module?.code}
        />
      </main>
    </div>
  );
}
