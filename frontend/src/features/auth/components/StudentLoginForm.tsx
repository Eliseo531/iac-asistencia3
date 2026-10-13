'use client';

import React, { useState } from 'react';
import { useStudentAuth } from '../hooks/useStudentAuth';
import { GraduationCap, AlertCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';

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
    <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-zinc-800 p-8 sm:p-10 transition-colors">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 mb-4 border border-indigo-100 dark:border-indigo-800/60 shadow-sm">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
          Portal del Estudiante
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
          Ingrese su identificación para registrar o consultar su asistencia académica
        </p>
      </div>

      {displayedError && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-start space-x-3"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500 dark:text-rose-400" />
          <span className="font-medium">{displayedError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="identifier"
            className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2"
          >
            Correo Electrónico o N° de Registro
          </label>
          <input
            id="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Ej. 1001 o juan@gmail.com"
            disabled={isLoading}
            className={`w-full px-4 py-3.5 rounded-xl border text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 bg-slate-50/50 dark:bg-zinc-800/60 focus:bg-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-2 transition ${
              displayedError
                ? 'border-rose-300 dark:border-rose-800 focus:ring-rose-200 dark:focus:ring-rose-900'
                : 'border-slate-200 dark:border-zinc-700 focus:ring-indigo-100 dark:focus:ring-indigo-900/60 focus:border-indigo-500 dark:focus:border-indigo-500'
            } disabled:bg-slate-100 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed`}
          />
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
            No requiere contraseña. Solo debe estar matriculado en el módulo activo.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Verificando matrícula...</span>
            </>
          ) : (
            <>
              <span>Ingresar al Sistema</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800 text-center">
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-zinc-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Datos sembrados: <strong className="text-slate-600 dark:text-zinc-300">1001</strong> o <strong className="text-slate-600 dark:text-zinc-300">juan@gmail.com</strong></span>
        </div>
      </div>
    </div>
  );
}
