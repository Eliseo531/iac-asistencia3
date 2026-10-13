'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useModuleImportWizard } from '@/features/modules/hooks/useModuleImportWizard';
import { ModuleMetadataForm } from '@/features/modules/components/ModuleMetadataForm';
import { ModulePreviewSummaryCards } from '@/features/modules/components/ModulePreviewSummaryCards';
import { ModulePreviewTabs } from '@/features/modules/components/ModulePreviewTabs';
import { ActivationModalConfirmation } from '@/features/modules/components/ActivationModalConfirmation';

export default function ModulePreviewPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  const {
    metadata,
    setMetadata,
    students,
    schedules,
    studentErrors,
    scheduleErrors,
    estimatedStartDate,
    estimatedEndDate,
    hasErrors,
    isFormComplete,
    canActivate,
    isConfirmationOpen,
    setIsConfirmationOpen,
    isActivating,
    activationSuccess,
    errorMessage,
    activateModule,
  } = useModuleImportWizard();

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

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Cabecera y Navegación del Asistente */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              <Link
                href="/admin/modulo/importar"
                className="hover:underline flex items-center gap-1 text-slate-500"
              >
                Paso 1: Estudiantes
              </Link>
              <span>/</span>
              <Link
                href="/admin/modulo/importar/fechas"
                className="hover:underline flex items-center gap-1 text-slate-500"
              >
                Paso 2: Calendario
              </Link>
              <span>/</span>
              <span className="text-indigo-600 font-bold">Paso 3: Vista Previa</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Paso 3: Vista Previa y Activación del Módulo
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Revise la nómina consolidada y el cronograma de clases antes de confirmar la activación del módulo (RF-16, RF-18).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancelar Asistente
            </Link>
          </div>
        </div>

        {/* Notificación de Éxito al Activar */}
        {activationSuccess && (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 shadow-sm space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-900">
                  ¡Módulo Académico Activado Exitosamente!
                </h3>
                <p className="text-xs text-emerald-700 mt-0.5">
                  El módulo &quot;{metadata.name}&quot; ({metadata.code}) se ha establecido como el módulo activo en el sistema.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                href="/admin/dashboard"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Ir al Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Mensaje de Error si aplica */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-3 shadow-sm">
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

        {/* Advertencia si no hay datos cargados */}
        {students.length === 0 && schedules.length === 0 && (
          <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-amber-600 shrink-0"
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
              <span>
                No se encontraron datos cargados en la sesión. Inicie cargando la nómina de estudiantes y el calendario.
              </span>
            </div>
            <Link
              href="/admin/modulo/importar"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs whitespace-nowrap transition-all"
            >
              Iniciar en Paso 1
            </Link>
          </div>
        )}

        {/* Formulario de Metadatos del Módulo */}
        <ModuleMetadataForm
          metadata={metadata}
          onChange={setMetadata}
          disabled={activationSuccess}
        />

        {/* Tarjetas Resumen KPI */}
        <ModulePreviewSummaryCards
          totalStudents={students.length}
          totalSchedules={schedules.length}
          estimatedStartDate={estimatedStartDate}
          estimatedEndDate={estimatedEndDate}
          canActivate={canActivate}
          hasErrors={hasErrors}
        />

        {/* Pestañas de Visualización de Nómina y Cronograma */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <ModulePreviewTabs
            students={students}
            schedules={schedules}
            studentErrors={studentErrors}
            scheduleErrors={scheduleErrors}
          />
        </div>

        {/* Barra de Acciones de Activación */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-200">
          <Link
            href="/admin/modulo/importar/fechas"
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
            <span>Volver a Paso 2 (Calendario)</span>
          </Link>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {!canActivate && (
              <span className="text-xs text-rose-600 font-semibold text-center sm:text-right">
                {hasErrors
                  ? 'Debe corregir las inconsistencias antes de activar.'
                  : !isFormComplete
                  ? 'Complete el nombre, código y cargue ambos archivos.'
                  : ''}
              </span>
            )}

            <button
              type="button"
              disabled={!canActivate || activationSuccess}
              onClick={() => setIsConfirmationOpen(true)}
              className={`inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm shadow-sm transition-all ${
                canActivate && !activationSuccess
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 cursor-pointer'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Activar Módulo</span>
            </button>
          </div>
        </div>

        {/* Modal de Confirmación */}
        <ActivationModalConfirmation
          isOpen={isConfirmationOpen}
          metadata={metadata}
          totalStudents={students.length}
          totalSchedules={schedules.length}
          onClose={() => setIsConfirmationOpen(false)}
          onConfirm={activateModule}
          isSubmitting={isActivating}
        />
      </div>
    </div>
  );
}
