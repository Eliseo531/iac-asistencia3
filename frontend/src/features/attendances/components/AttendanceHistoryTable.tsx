'use client';

import React from 'react';
import { ClassSessionHistoryItem } from '../types/attendance.types';
import { formatDate } from '../../../lib/utils';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
} from 'lucide-react';

interface AttendanceHistoryTableProps {
  sessions: ClassSessionHistoryItem[];
}

export function AttendanceHistoryTable({ sessions }: AttendanceHistoryTableProps) {
  const formatTime = (timeString?: string | Date | null) => {
    if (!timeString) return '—';
    if (typeof timeString === 'string' && timeString.includes('T')) {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }
    return String(timeString);
  };

  const getStatusBadge = (status: ClassSessionHistoryItem['status']) => {
    switch (status) {
      case 'PRESENTE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Presente
          </span>
        );
      case 'FALTA':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            Falta
          </span>
        );
      case 'PENDIENTE_HOY':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Pendiente (Hoy)
          </span>
        );
      case 'PROGRAMADA':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Programada
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-sm overflow-hidden transition-colors">
      <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-zinc-50">
            Cronograma de Clases y Asistencias
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Registro cronológico oficial del módulo. Las fechas pasadas no marcadas calculan falta automática (RN-05).
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 dark:bg-zinc-800/40 border-b border-slate-100 dark:border-zinc-800 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              <th className="py-3.5 px-6">Fecha de Clase</th>
              <th className="py-3.5 px-6">Horario</th>
              <th className="py-3.5 px-6">Estado</th>
              <th className="py-3.5 px-6">Hora de Marcación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-sm">
            {sessions.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400 dark:text-zinc-500">
                  No hay clases programadas en este módulo académico.
                </td>
              </tr>
            ) : (
              sessions.map((session) => (
                <tr
                  key={session.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="py-4 px-6 font-semibold text-slate-900 dark:text-zinc-100">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-slate-400" />
                      <span>{formatDate(session.classDate)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600 dark:text-zinc-300">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{session.startTime} - {session.endTime}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(session.status)}
                  </td>
                  <td className="py-4 px-6 text-xs font-mono text-slate-600 dark:text-zinc-400">
                    {formatTime(session.markedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
