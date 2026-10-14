'use client';

import React from 'react';
import { useAttendanceCheckIn } from '../hooks/useAttendanceCheckIn';
import { formatDate } from '../../../lib/utils';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  CalendarOff,
  ShieldCheck,
  Loader2,
  Check,
} from 'lucide-react';

interface TodayClassCardProps {
  moduleName?: string;
  moduleCode?: string;
}

export function TodayClassCard({
  moduleName = 'Módulo Activo',
  moduleCode = '',
}: TodayClassCardProps) {
  const {
    data,
    isLoading,
    isSubmitting,
    successMessage,
    errorMessage,
    executeCheckIn,
  } = useAttendanceCheckIn();

  const handleCheckIn = async () => {
    try {
      await executeCheckIn();
    } catch {
      // Error gestionado en el hook
    }
  };

  const formatTime = (timeString?: string | Date | null) => {
    if (!timeString) return '';
    if (typeof timeString === 'string' && timeString.includes('T')) {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    return String(timeString);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-xl dark:shadow-2xl border border-slate-200/80 dark:border-zinc-800 overflow-hidden transition-colors">
      {/* Header de la tarjeta */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 p-6 sm:p-7 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider uppercase border border-white/10">
            {moduleCode || 'Módulo Activo'}
          </span>
          <span className="text-xs text-indigo-100 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            En línea
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold leading-snug">{moduleName}</h2>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Banner de Éxito */}
        {successMessage && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-start space-x-3 animate-fade-in"
          >
            <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="font-semibold">{successMessage}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                Tu asistencia ha sido auditada y almacenada de forma inmutable.
              </p>
            </div>
          </div>
        )}

        {/* Banner de Error */}
        {errorMessage && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm flex items-start space-x-3"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Estado de carga */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
            <p className="text-sm text-slate-500 dark:text-zinc-400">Verificando calendario de clases...</p>
          </div>
        ) : data?.hasClassToday ? (
          /* Hay clase programada hoy */
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/70 dark:border-zinc-700/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                  Sesión Programada Hoy
                </span>
                <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-zinc-100">
                  <CalendarDays className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
                  <span>{formatDate(data.classSchedule?.classDate || '')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Horario: {data.classSchedule?.startTime} a {data.classSchedule?.endTime}</span>
                </div>
              </div>

              <div className="text-right">
                {data.alreadyMarked ? (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Presente
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    Pendiente
                  </span>
                )}
              </div>
            </div>

            {/* Botón de Marcación Dinámico */}
            {data.alreadyMarked ? (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-1 border border-emerald-200 dark:border-emerald-800">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-zinc-100 text-base">
                  Asistencia Ya Registrada
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Marcada a las {formatTime(data.attendance?.markedAt)}
                </p>
                <button
                  disabled
                  className="w-full mt-2 py-3.5 px-4 bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 font-semibold rounded-xl cursor-not-allowed border border-slate-300 dark:border-zinc-700"
                >
                  Marca Completada para Esta Sesión
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={handleCheckIn}
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-lg rounded-2xl shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                      <span>Guardando marca...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-6 h-6" />
                      <span>Registrar Asistencia de Hoy</span>
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 dark:text-zinc-500 mt-2">
                  Solo se permite una marcación por estudiante por sesión de clase.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* No hay clase programada hoy (RN-04) */
          <div className="py-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 mb-1 border border-slate-200 dark:border-zinc-700">
              <CalendarOff className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-zinc-100 text-lg">
                Hoy no hay clase programada
              </h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
                La marcación sólo está habilitada en días hábiles de clase fijados en el calendario académico.
              </p>
            </div>

            {data?.nextScheduledClass && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-xs text-slate-600 dark:text-zinc-300 inline-flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-indigo-500" />
                <span>
                  <strong>Próxima clase programada:</strong>{' '}
                  {formatDate(data.nextScheduledClass.classDate)} ({data.nextScheduledClass.startTime} a {data.nextScheduledClass.endTime})
                </span>
              </div>
            )}

            <button
              disabled
              className="w-full py-3.5 px-4 bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 font-semibold rounded-xl cursor-not-allowed border border-slate-200 dark:border-zinc-700"
            >
              Botón de Marcación Deshabilitado (Fuera de Fecha)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
