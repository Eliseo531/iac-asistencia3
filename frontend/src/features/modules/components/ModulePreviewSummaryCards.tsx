'use client';

import React from 'react';

interface ModulePreviewSummaryCardsProps {
  totalStudents: number;
  totalSchedules: number;
  estimatedStartDate?: string;
  estimatedEndDate?: string;
  canActivate: boolean;
  hasErrors: boolean;
}

export const ModulePreviewSummaryCards: React.FC<ModulePreviewSummaryCardsProps> = ({
  totalStudents,
  totalSchedules,
  estimatedStartDate,
  estimatedEndDate,
  canActivate,
  hasErrors,
}) => {
  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Sin definir';
    try {
      const [year, month, day] = isoString.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Tarjeta 1: Total Estudiantes */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            Estudiantes
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-slate-900">
              {totalStudents}
            </span>
            <span className="text-xs text-slate-500">nómina activa</span>
          </div>
        </div>
      </div>

      {/* Tarjeta 2: Clases Programadas */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            Sesiones de Clase
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-slate-900">
              {totalSchedules}
            </span>
            <span className="text-xs text-slate-500">fechas válidas</span>
          </div>
        </div>
      </div>

      {/* Tarjeta 3: Período Académico */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            Período Estimado
          </span>
          <p className="text-xs font-bold text-slate-800 mt-1 truncate">
            {estimatedStartDate ? formatDate(estimatedStartDate) : '--'} al{' '}
            {estimatedEndDate ? formatDate(estimatedEndDate) : '--'}
          </p>
        </div>
      </div>

      {/* Tarjeta 4: Estado de Activación */}
      <div
        className={`p-5 rounded-2xl border shadow-sm flex items-center gap-4 ${
          hasErrors
            ? 'bg-rose-50/60 border-rose-200'
            : canActivate
            ? 'bg-emerald-50/60 border-emerald-200'
            : 'bg-amber-50/60 border-amber-200'
        }`}
      >
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            hasErrors
              ? 'bg-rose-100 text-rose-700'
              : canActivate
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {hasErrors ? (
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          ) : canActivate ? (
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            Aptitud para Activar
          </span>
          <span
            className={`text-sm font-black block mt-0.5 ${
              hasErrors
                ? 'text-rose-700'
                : canActivate
                ? 'text-emerald-700'
                : 'text-amber-700'
            }`}
          >
            {hasErrors
              ? 'Errores presentes'
              : canActivate
              ? 'Habilitado'
              : 'Incompleto'}
          </span>
        </div>
      </div>
    </div>
  );
};
