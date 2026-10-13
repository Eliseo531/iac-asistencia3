'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStudentAuth } from '@/features/auth/hooks/useStudentAuth';
import { TodayClassCard } from '@/features/attendances/components/TodayClassCard';

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
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-3">
          <svg
            className="animate-spin h-8 w-8 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span className="text-sm font-medium text-slate-500">
            Cargando sesión del estudiante...
          </span>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      {/* Barra de navegación superior */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
              🎓
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">
                {student.fullName}
              </h1>
              <p className="text-xs text-slate-500">
                Registro: <strong className="text-slate-700">{student.registrationNumber}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/asistencia"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
            >
              Marcación de Hoy
            </Link>
            <Link
              href="/historial"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              Mi Historial
            </Link>
            <button
              onClick={logout}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition ml-2"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 mb-2">
            Control de Asistencia Diario
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Registro de Asistencia del Estudiante
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
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
