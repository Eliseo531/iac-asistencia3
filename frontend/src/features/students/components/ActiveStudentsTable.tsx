'use client';

import React from 'react';
import { StudentItem } from '../types/student.types';

interface ActiveStudentsTableProps {
  students: StudentItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  searchTerm?: string;
  onClearSearch?: () => void;
  isLoading?: boolean;
}

export const ActiveStudentsTable: React.FC<ActiveStudentsTableProps> = ({
  students,
  totalCount,
  currentPage,
  totalPages,
  limit,
  onPageChange,
  searchTerm = '',
  onClearSearch,
  isLoading = false,
}) => {
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalCount);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-4">
      {/* Contenedor de la tabla responsiva */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Matrícula / Registro</th>
                <th className="py-3.5 px-4">Nombre Completo</th>
                <th className="py-3.5 px-4">Correo Electrónico</th>
                <th className="py-3.5 px-4 text-right">Fecha de Alta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-900 dark:text-zinc-100">
              {isLoading ? (
                // Skeletons de carga
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skel-${idx}`} className="animate-pulse">
                    <td className="py-4 px-4 text-center">
                      <div className="h-4 w-6 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : students.length === 0 ? (
                // Estado vacío
                <tr>
                  <td colSpan={5} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
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
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {searchTerm
                            ? `No se encontraron estudiantes que coincidan con "${searchTerm}"`
                            : 'No hay estudiantes matriculados'}
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {searchTerm
                            ? 'Prueba con otro número de registro, nombre o dirección de correo.'
                            : 'El módulo académico activo aún no tiene estudiantes cargados en el sistema.'}
                        </p>
                      </div>
                      {searchTerm && onClearSearch && (
                        <button
                          type="button"
                          onClick={onClearSearch}
                          className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition"
                        >
                          Limpiar búsqueda
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                // Filas de estudiantes
                students.map((student, idx) => {
                  const itemNumber = (currentPage - 1) * limit + idx + 1;
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-center font-mono text-xs text-zinc-400 dark:text-zinc-500">
                        {itemNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-mono text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40">
                          {student.registrationNumber}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                            {student.fullName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {student.fullName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <a
                          href={`mailto:${student.email}`}
                          className="text-xs text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 underline-offset-2 hover:underline transition"
                        >
                          {student.email}
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-right text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                        {formatDate(student.createdAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Barra inferior de paginación */}
        {totalCount > 0 && (
          <div className="px-4 py-3 bg-zinc-50/70 dark:bg-zinc-900/60 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600 dark:text-zinc-400">
            <div>
              Mostrando{' '}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {startItem}
              </span>{' '}
              a{' '}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {endItem}
              </span>{' '}
              de{' '}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {totalCount}
              </span>{' '}
              estudiantes
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Anterior
              </button>

              <span className="px-2 font-mono font-medium">
                Pág. {currentPage} de {totalPages || 1}
              </span>

              <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
