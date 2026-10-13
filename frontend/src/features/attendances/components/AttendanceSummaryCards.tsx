'use client';

import React from 'react';
import { AttendanceSummaryMetrics } from '../types/attendance.types';
import {
  CheckCircle2,
  XCircle,
  CalendarDays,
  Percent,
} from 'lucide-react';

interface AttendanceSummaryCardsProps {
  summary: AttendanceSummaryMetrics;
}

export function AttendanceSummaryCards({ summary }: AttendanceSummaryCardsProps) {
  const percentage = summary.attendancePercentage ?? 0;

  // Semáforo de porcentaje
  const getPercentageColor = (pct: number) => {
    if (pct >= 80) {
      return {
        text: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        border: 'border-emerald-200 dark:border-emerald-800',
        bar: 'bg-emerald-500',
        label: 'Excelente',
      };
    }
    if (pct >= 70) {
      return {
        text: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        border: 'border-amber-200 dark:border-amber-800',
        bar: 'bg-amber-500',
        label: 'Al límite',
      };
    }
    return {
      text: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-200 dark:border-rose-800',
      bar: 'bg-rose-500',
      label: 'Riesgo de reprobación',
    };
  };

  const statusColor = getPercentageColor(percentage);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* 1. Tarjeta % Asistencia */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
            % Asistencia
          </span>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/60">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className={`text-3xl font-extrabold ${statusColor.text}`}>
            {percentage.toFixed(1)}%
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor.bg} ${statusColor.text} border ${statusColor.border}`}>
            {statusColor.label}
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${statusColor.bar}`}
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          ></div>
        </div>
      </div>

      {/* 2. Tarjeta Presentes */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
            Asistencias
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/60">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-zinc-50">
            {summary.attendedCount}
          </span>
          <span className="text-xs text-slate-400 dark:text-zinc-500">
            {summary.attendedCount === 1 ? 'clase asistida' : 'clases asistidas'}
          </span>
        </div>
        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
          Marcaciones registradas a tiempo
        </p>
      </div>

      {/* 3. Tarjeta Faltas */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
            Faltas
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-800/60">
            <XCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-zinc-50">
            {summary.absentCount}
          </span>
          <span className="text-xs text-slate-400 dark:text-zinc-500">
            {summary.absentCount === 1 ? 'falta acumulada' : 'faltas acumuladas'}
          </span>
        </div>
        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
          Calculadas automáticamente (RN-05)
        </p>
      </div>

      {/* 4. Tarjeta Progreso del Calendario */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
            Progreso Módulo
          </span>
          <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 flex items-center justify-center border border-slate-200 dark:border-zinc-700">
            <CalendarDays className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-zinc-50">
            {summary.pastClasses}
          </span>
          <span className="text-xs text-slate-400 dark:text-zinc-500">
            de {summary.totalClasses} clases
          </span>
        </div>
        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
          {summary.totalClasses - summary.pastClasses} clases futuras programadas
        </p>
      </div>
    </div>
  );
}
