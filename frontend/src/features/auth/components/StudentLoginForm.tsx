'use client';

import React, { useState } from 'react';
import { useStudentAuth } from '../hooks/useStudentAuth';

export function StudentLoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const { login, isLoading, error } = useStudentAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const trimmed = identifier.trim();
    if (!trimmed) {
      setLocalError('Por favor ingrese su correo electrónico o su número de registro.');
      return;
    }

    try {
      await login(trimmed);
    } catch {
      // El error ya se gestiona en useStudentAuth
    }
  };

  const displayedError = localError || error;

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l9-5-9-5-9 5 9 5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Portal del Estudiante
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Ingrese su identificación para registrar o consultar su asistencia
        </p>
      </div>

      {displayedError && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start space-x-3"
        >
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">{displayedError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="identifier"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Correo Electrónico o N° de Registro
          </label>
          <div className="relative">
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Ej. juan@gmail.com o 1001"
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-xl border text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                displayedError
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-500'
              } disabled:bg-slate-50 disabled:cursor-not-allowed`}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            No requiere contraseña. Solo debe estar matriculado en el módulo activo.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
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
              <span>Verificando matrícula...</span>
            </>
          ) : (
            <span>Ingresar al Sistema</span>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400">
          ¿Datos de prueba sembrados? Pruebe con <strong className="text-slate-600">1001</strong> o{' '}
          <strong className="text-slate-600">juan@gmail.com</strong>
        </p>
      </div>
    </div>
  );
}
