'use client';

import React, { useEffect, useState } from 'react';

interface StudentSearchBarProps {
  value?: string;
  onSearchChange: (search: string) => void;
  debounceMs?: number;
  placeholder?: string;
  isLoading?: boolean;
}

export const StudentSearchBar: React.FC<StudentSearchBarProps> = ({
  value = '',
  onSearchChange,
  debounceMs = 300,
  placeholder = 'Buscar por número de matrícula, nombre completo o correo...',
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(value);

  // Sincronizar si cambia el valor externamente
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Aplicar debounce de 300ms al escribir
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(searchTerm);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debounceMs, onSearchChange]);

  const handleClear = () => {
    setSearchTerm('');
    onSearchChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="relative w-full">
      {/* Icono de búsqueda */}
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input interactivo */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
      />

      {/* Indicador de carga o botón de limpiar */}
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        ) : searchTerm ? (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            title="Limpiar búsqueda (Esc)"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
};
