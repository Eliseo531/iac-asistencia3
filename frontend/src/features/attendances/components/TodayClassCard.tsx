'use client';

import React from 'react';
import { useAttendanceCheckIn } from '../hooks/useAttendanceCheckIn';
import { formatDate } from '../../../lib/utils';

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
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Header de la tarjeta */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider uppercase">
            {moduleCode || 'Módulo Activo'}
          </span>
          <span className="text-xs text-indigo-100 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            En línea
          </span>
        </div>
        <h2 className="text-xl font-bold leading-snug">{moduleName}</h2>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Banner de Éxito */}
        {successMessage && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start space-x-3 animate-fade-in"
          >
            <svg
              className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold">{successMessage}</p>
              <p className="text-xs text-emerald-600 mt-0.5">
                Tu asistencia ha sido auditada y almacenada de forma inmutable.
              </p>
            </div>
          </div>
        )}

        {/* Banner de Error */}
        {errorMessage && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start space-x-3"
          >
            <svg
              className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Estado de carga */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
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
            <p className="text-sm text-slate-500">Verificando calendario de clases...</p>
          </div>
        ) : data?.hasClassToday ? (
          /* Hay clase programada hoy */
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
                  Sesión Programada Hoy
                </span>
                <p className="text-base font-bold text-slate-800">
                  {formatDate(data.classSchedule?.classDate || '')}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Horario: {data.classSchedule?.startTime} a {data.classSchedule?.endTime}
                </p>
              </div>

              <div className="text-right">
                {data.alreadyMarked ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Presente
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Pendiente
                  </span>
                )}
              </div>
            </div>

            {/* Botón de Marcación Dinámico */}
            {data.alreadyMarked ? (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-1">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-800 text-base">
                  Asistencia Ya Registrada
                </h3>
                <p className="text-xs text-slate-500">
                  Marcada a las {formatTime(data.attendance?.markedAt)}
                </p>
                <button
                  disabled
                  className="w-full mt-2 py-3 px-4 bg-slate-200 text-slate-400 font-medium rounded-xl cursor-not-allowed"
                >
                  Marca Completada para Esta Sesión
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={handleCheckIn}
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-lg rounded-2xl shadow-xl shadow-emerald-200 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-6 w-6 text-white"
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
                      <span>Guardando marca...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Registrar Asistencia de Hoy</span>
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 mt-2">
                  Solo se permite una marcación por estudiante por sesión de clase.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* No hay clase programada hoy (RN-04) */
          <div className="py-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-1">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">
                Hoy no hay clase programada
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
                La marcación sólo está habilitada en días hábiles de clase fijados en el calendario académico.
              </p>
            </div>

            {data?.nextScheduledClass && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 inline-block">
                <strong>Próxima clase programada:</strong>{' '}
                {formatDate(data.nextScheduledClass.classDate)} de {data.nextScheduledClass.startTime} a {data.nextScheduledClass.endTime}
              </div>
            )}

            <button
              disabled
              className="w-full py-3.5 px-4 bg-slate-100 text-slate-400 font-semibold rounded-xl cursor-not-allowed border border-slate-200"
            >
              Botón de Marcación Deshabilitado (Fuera de Fecha)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
