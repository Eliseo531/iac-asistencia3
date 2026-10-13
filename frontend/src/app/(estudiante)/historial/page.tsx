'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStudentAuth } from '@/features/auth/hooks/useStudentAuth';
import { useAttendanceHistory } from '@/features/attendances/hooks/useAttendanceHistory';
import { AttendanceSummaryCards } from '@/features/attendances/components/AttendanceSummaryCards';
import { AttendanceHistoryTable } from '@/features/attendances/components/AttendanceHistoryTable';
import {
  GraduationCap,
  CalendarCheck,
  History,
  LogOut,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function HistorialPage() {
  const router = useRouter();
  const { student, isLoading: isAuthLoading, logout } = useStudentAuth();
  const { history, isLoading: isHistoryLoading, errorMessage, refreshHistory } =
    useAttendanceHistory();

  useEffect(() => {
    if (!isAuthLoading && !student) {
      router.push('/login');
    }
  }, [isAuthLoading, student, router]);

  if (isAuthLoading || !student) {
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Marcación de Hoy</span>
            </Link>
            <Link
              href="/historial"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-xs"
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
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 mb-2">
              <span>{student.module?.code}</span>
              <span>•</span>
              <span>{student.module?.name}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
              Historial de Asistencia Personal
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
              Consulta el balance de clases asistidas, faltas automáticas y porcentaje acumulado (RF-04, RF-05).
            </p>
          </div>

          <button
            onClick={refreshHistory}
            disabled={isHistoryLoading}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isHistoryLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm flex items-start space-x-3"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {isHistoryLoading && !history ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Calculando asistencias y cronograma...
            </p>
          </div>
        ) : history ? (
          <div className="space-y-8 animate-fade-in">
            {/* Tarjetas de Resumen Superior */}
            <AttendanceSummaryCards summary={history.summary} />

            {/* Tabla Detallada de Clases */}
            <AttendanceHistoryTable sessions={history.sessions} />
          </div>
        ) : null}
      </main>
    </div>
  );
}
