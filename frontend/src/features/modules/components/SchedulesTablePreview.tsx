'use client';

import React from 'react';
import { ScheduleRow } from '../types/schedule-import.types';

interface SchedulesTablePreviewProps {
  schedules: ScheduleRow[];
}

export const SchedulesTablePreview: React.FC<SchedulesTablePreviewProps> = ({
  schedules,
}) => {
  if (!schedules || schedules.length === 0) return null;

  const formatDate = (isoDate: string): string => {
    const parts = isoDate.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return isoDate;
  };

  const startDate = schedules[0]?.classDate;
  const endDate = schedules[schedules.length - 1]?.classDate;

  return (
    <div className="w-full space-y-4">
      {/* Tarjetas KPI de Resumen del Calendario */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total de Clases</p>
            <p className="text-lg font-bold text-slate-900">
              {schedules.length} Sesiones
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Inicio Estimado</p>
            <p className="text-lg font-bold text-slate-900">
              {startDate ? formatDate(startDate) : '-'}
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
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
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Cierre Estimado</p>
            <p className="text-lg font-bold text-slate-900">
              {endDate ? formatDate(endDate) : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabla Cronológica */}
      <div className="bg-white rounded-xl border border-emerald-200 overflow-hidden shadow-sm">
        <div className="bg-emerald-50/80 px-6 py-4 border-b border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-900">
                Calendario ordenado cronológicamente
              </h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                Las fechas determinarán los días habilitados para que los
                estudiantes marquen asistencia (RN-04).
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-200 text-emerald-800 text-xs font-semibold rounded-full">
            Validado
          </span>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider sticky top-0">
              <tr>
                <th className="px-4 py-3 text-center">Sesión #</th>
                <th className="px-4 py-3">Fecha de Clase</th>
                <th className="px-4 py-3">Horario Programado</th>
                <th className="px-4 py-3">Ventana de Marcación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedules.map((item, idx) => (
                <tr
                  key={item.classDate}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-4 py-3 text-center text-slate-400 font-mono font-bold">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                      {formatDate(item.classDate)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-mono">
                    {item.startTime} — {item.endTime}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px]">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      Todo el día (00:00 - 23:59)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
