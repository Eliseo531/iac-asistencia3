'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileDropzone } from '@/features/modules/components/FileDropzone';
import { ScheduleErrorsTable } from '@/features/modules/components/ScheduleErrorsTable';
import { SchedulesTablePreview } from '@/features/modules/components/SchedulesTablePreview';
import { ModuleImportService } from '@/features/modules/services/module-import.service';
import { RowValidationError } from '@/features/modules/types/module-import.types';
import { ScheduleRow } from '@/features/modules/types/schedule-import.types';

export default function ImportarFechasPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorsList, setErrorsList] = useState<RowValidationError[]>([]);
  const [validSchedules, setValidSchedules] = useState<ScheduleRow[]>([]);

  useEffect(() => {
    const storedToken =
      localStorage.getItem('admin_token') ||
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('admin_token='))
        ?.split('=')[1];

    if (!storedToken) {
      router.push('/admin/login');
      return;
    }
    setToken(storedToken);
  }, [router]);

  const handleFileSelected = async (file: File) => {
    if (!token) return;

    setIsLoading(true);
    setErrorMessage(null);
    setErrorsList([]);
    setValidSchedules([]);

    const response = await ModuleImportService.importSchedules(file, token);
    setIsLoading(false);

    if (!response.success) {
      setErrorMessage(response.message);
      if (response.errorData && response.errorData.errors) {
        setErrorsList(response.errorData.errors);
      }
    } else if (response.data) {
      setValidSchedules(response.data.schedules);
      // Guardar en sessionStorage para que el Wizard de US-06 lo tome
      sessionStorage.setItem(
        'pending_schedules_import',
        JSON.stringify(response.data.schedules),
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Cabecera y Navegación */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              <Link
                href="/admin/modulo/importar"
                className="hover:underline flex items-center gap-1 text-slate-500"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Paso 1: Estudiantes
              </Link>
              <span>/</span>
              <span>Paso 2: Calendario</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Paso 2: Importar Fechas y Horarios de Clase
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Cargue el archivo Excel con el cronograma de fechas de clase del
              módulo (RF-12, RN-04).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200">
              Paso 2 de 3
            </span>
          </div>
        </div>

        {/* Guía informativa de formato */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Requisitos del archivo Excel de Calendario
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            El archivo debe contener las siguientes 3 columnas en la primera fila:
          </p>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-800 block">1. Fecha</span>
              <span className="text-slate-500 text-[11px]">
                Formato DD/MM/YYYY. Determina el día habilitado para marcar (RN-04).
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-800 block">
                2. Hora inicio
              </span>
              <span className="text-slate-500 text-[11px]">
                Formato 24h (ej. 18:00). Informativo en esta versión.
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-800 block">
                3. Hora fin
              </span>
              <span className="text-slate-500 text-[11px]">
                Formato 24h (ej. 21:00). Informativo en esta versión.
              </span>
            </div>
          </div>
        </div>

        {/* Zona de Carga de Archivo */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <FileDropzone
            onFileSelected={handleFileSelected}
            isLoading={isLoading}
            title="Seleccionar archivo de fechas y horarios (.xlsx)"
            subtitle="Arrastre el archivo Excel o haga clic para examinar"
          />

          {isLoading && (
            <div className="mt-6 flex items-center justify-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-700 text-sm">
              <svg
                className="animate-spin h-5 w-5 text-indigo-600"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <span>Validando fechas, horarios y coherencia temporal...</span>
            </div>
          )}
        </div>

        {/* Errores */}
        {errorsList.length > 0 && (
          <ScheduleErrorsTable errors={errorsList} />
        )}

        {/* Mensaje de Error General */}
        {errorMessage && errorsList.length === 0 && !isLoading && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-center gap-2">
            <svg
              className="w-5 h-5 text-rose-600 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Vista previa de fechas válidas */}
        {validSchedules.length > 0 && (
          <div className="space-y-6">
            <SchedulesTablePreview schedules={validSchedules} />

            {/* Botón de Siguiente Paso */}
            <div className="flex justify-between items-center pt-4">
              <Link
                href="/admin/modulo/importar"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-sm rounded-xl transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>Volver a Estudiantes</span>
              </Link>

              <Link
                href="/admin/modulo/preview"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all"
              >
                <span>Continuar a Paso 3: Vista Previa y Activación</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
