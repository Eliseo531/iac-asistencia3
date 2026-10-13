'use client';

import React from 'react';
import { ModuleMetadata } from '../types/module-preview.types';

interface ModuleMetadataFormProps {
  metadata: ModuleMetadata;
  onChange: (updated: ModuleMetadata) => void;
  disabled?: boolean;
}

export const ModuleMetadataForm: React.FC<ModuleMetadataFormProps> = ({
  metadata,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Información General del Módulo
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Ingrese los datos identificadores del módulo académico antes de proceder a la activación.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Nombre del Módulo <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ej. Módulo 2: Infraestructura como Código (IaC)"
            value={metadata.name}
            disabled={disabled}
            onChange={(e) => onChange({ ...metadata, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-60"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Código Identificador <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ej. DCID-V1E1-M2"
            value={metadata.code}
            disabled={disabled}
            onChange={(e) => onChange({ ...metadata, code: e.target.value.toUpperCase() })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-60 uppercase"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Descripción u Observaciones (Opcional)
        </label>
        <textarea
          rows={2}
          placeholder="Notas adicionales o descripción del alcance del módulo..."
          value={metadata.description || ''}
          disabled={disabled}
          onChange={(e) => onChange({ ...metadata, description: e.target.value })}
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-60 resize-none"
        />
      </div>
    </div>
  );
};
