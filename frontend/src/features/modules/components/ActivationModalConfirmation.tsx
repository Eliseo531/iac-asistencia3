'use client';

import React from 'react';
import { ModuleMetadata } from '../types/module-preview.types';

interface ActivationModalConfirmationProps {
  isOpen: boolean;
  metadata: ModuleMetadata;
  totalStudents: number;
  totalSchedules: number;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export const ActivationModalConfirmation: React.FC<
  ActivationModalConfirmationProps
> = ({
  isOpen,
  metadata,
  totalStudents,
  totalSchedules,
  onClose,
  onConfirm,
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 transform transition-all animate-in fade-in zoom-in-95 duration-150">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 border border-amber-100">
          <svg
            className="w-7 h-7"
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
        </div>

        <div className="text-center">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            ¿Confirmar Activación de Módulo?
          </h3>
          <p className="text-xs text-slate-500 mt-2">
            Verifique la información consolidada antes de proceder (RF-13, RF-18).
          </p>
        </div>

        {/* Resumen del Módulo a Activar */}
        <div className="my-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-medium">Módulo:</span>
            <span className="font-bold text-slate-900 text-right">
              {metadata.name || 'Sin especificar'}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-medium">Código:</span>
            <span className="font-mono font-bold text-indigo-600">
              {metadata.code || 'Sin código'}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-medium">Estudiantes a matricular:</span>
            <span className="font-bold text-slate-900">{totalStudents}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Clases programadas:</span>
            <span className="font-bold text-slate-900">{totalSchedules}</span>
          </div>
        </div>

        {/* Advertencia de Regla de Negocio (RN-01, RN-08) */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
          <svg
            className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"
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
          <div>
            <strong className="block font-bold">Regla de Negocio (RN-01 / RN-08):</strong>
            Solo puede existir un módulo activo a la vez en el sistema. Al confirmar, este módulo se convertirá en el activo oficial para el registro de asistencias.
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-1/2 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full sm:w-1/2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span>Activando...</span>
              </>
            ) : (
              <span>Confirmar y Activar</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
