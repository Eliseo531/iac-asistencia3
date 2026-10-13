'use client';

import React, { useState } from 'react';
import { RowValidationError, StudentRow } from '../types/module-import.types';
import { ScheduleRow } from '../types/schedule-import.types';
import { StudentsTablePreview } from './StudentsTablePreview';
import { SchedulesTablePreview } from './SchedulesTablePreview';
import { StudentErrorsTable } from './StudentErrorsTable';
import { ScheduleErrorsTable } from './ScheduleErrorsTable';

interface ModulePreviewTabsProps {
  students: StudentRow[];
  schedules: ScheduleRow[];
  studentErrors: RowValidationError[];
  scheduleErrors: RowValidationError[];
}

export const ModulePreviewTabs: React.FC<ModulePreviewTabsProps> = ({
  students,
  schedules,
  studentErrors,
  scheduleErrors,
}) => {
  const hasErrors = studentErrors.length > 0 || scheduleErrors.length > 0;
  const [activeTab, setActiveTab] = useState<'students' | 'schedules' | 'errors'>(
    hasErrors ? 'errors' : 'students',
  );

  return (
    <div className="space-y-6">
      {/* Navegación por pestañas */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('students')}
          className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'students'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Nómina de Estudiantes</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 font-mono">
            {students.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('schedules')}
          className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'schedules'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Calendario de Clases</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 font-mono">
            {schedules.length}
          </span>
        </button>

        {hasErrors && (
          <button
            type="button"
            onClick={() => setActiveTab('errors')}
            className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'errors'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-rose-500 hover:text-rose-700'
            }`}
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>Inconsistencias y Errores</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-rose-100 text-rose-700 font-bold font-mono">
              {studentErrors.length + scheduleErrors.length}
            </span>
          </button>
        )}
      </div>

      {/* Contenido de la pestaña activa */}
      <div>
        {activeTab === 'students' && (
          <div>
            {students.length > 0 ? (
              <StudentsTablePreview students={students} />
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
                No hay nómina de estudiantes cargada. Por favor regrese al Paso 1 para importar el archivo.
              </div>
            )}
          </div>
        )}

        {activeTab === 'schedules' && (
          <div>
            {schedules.length > 0 ? (
              <SchedulesTablePreview schedules={schedules} />
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
                No hay fechas de clase cargadas. Por favor regrese al Paso 2 para importar el calendario.
              </div>
            )}
          </div>
        )}

        {activeTab === 'errors' && hasErrors && (
          <div className="space-y-6">
            {studentErrors.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-2">
                  Errores detectados en la Nómina de Estudiantes ({studentErrors.length})
                </h3>
                <StudentErrorsTable errors={studentErrors} />
              </div>
            )}

            {scheduleErrors.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-2">
                  Errores detectados en el Calendario de Clases ({scheduleErrors.length})
                </h3>
                <ScheduleErrorsTable errors={scheduleErrors} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
