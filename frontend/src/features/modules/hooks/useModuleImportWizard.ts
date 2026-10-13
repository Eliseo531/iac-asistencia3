'use client';

import { useState, useEffect, useMemo } from 'react';
import { RowValidationError, StudentRow } from '../types/module-import.types';
import { ScheduleRow } from '../types/schedule-import.types';
import { ModuleMetadata } from '../types/module-preview.types';

export function useModuleImportWizard() {
  const [metadata, setMetadata] = useState<ModuleMetadata>({
    name: '',
    code: '',
    description: '',
  });

  const [students, setStudents] = useState<StudentRow[]>([]);
  const [schedules, setSchedules] = useState<ScheduleRow[]>([]);
  const [studentErrors, setStudentErrors] = useState<RowValidationError[]>([]);
  const [scheduleErrors, setScheduleErrors] = useState<RowValidationError[]>([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [activationSuccess, setActivationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Carga inicial desde sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedStudents = sessionStorage.getItem('pending_students_import');
      if (storedStudents) {
        setStudents(JSON.parse(storedStudents));
      }

      const storedSchedules = sessionStorage.getItem('pending_schedules_import');
      if (storedSchedules) {
        setSchedules(JSON.parse(storedSchedules));
      }

      const storedMetadata = sessionStorage.getItem('pending_module_metadata');
      if (storedMetadata) {
        setMetadata(JSON.parse(storedMetadata));
      }
    } catch (e) {
      console.error('Error al recuperar datos del asistente:', e);
    }
  }, []);

  // Guardar metadata en sessionStorage ante cambios
  const handleMetadataChange = (newMeta: ModuleMetadata) => {
    setMetadata(newMeta);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pending_module_metadata', JSON.stringify(newMeta));
    }
  };

  const estimatedStartDate = useMemo(() => {
    return schedules.length > 0 ? schedules[0].classDate : '';
  }, [schedules]);

  const estimatedEndDate = useMemo(() => {
    return schedules.length > 0
      ? schedules[schedules.length - 1].classDate
      : '';
  }, [schedules]);

  const hasErrors = useMemo(() => {
    return studentErrors.length > 0 || scheduleErrors.length > 0;
  }, [studentErrors, scheduleErrors]);

  const isFormComplete = useMemo(() => {
    return (
      metadata.name.trim().length > 0 &&
      metadata.code.trim().length > 0 &&
      students.length > 0 &&
      schedules.length > 0
    );
  }, [metadata, students, schedules]);

  const canActivate = useMemo(() => {
    return isFormComplete && !hasErrors;
  }, [isFormComplete, hasErrors]);

  const activateModule = async () => {
    if (!canActivate) return;

    setIsActivating(true);
    setErrorMessage(null);

    try {
      // Simulación de activación (la persistencia en BD pertenece a US-07)
      // Guardamos el estado final consolidado
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'active_module_summary',
          JSON.stringify({
            metadata,
            totalStudents: students.length,
            totalSchedules: schedules.length,
            estimatedStartDate,
            estimatedEndDate,
            activatedAt: new Date().toISOString(),
          }),
        );
      }
      setActivationSuccess(true);
      setIsConfirmationOpen(false);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Error al intentar activar el módulo académico.',
      );
    } finally {
      setIsActivating(false);
    }
  };

  return {
    metadata,
    setMetadata: handleMetadataChange,
    students,
    setStudents,
    schedules,
    setSchedules,
    studentErrors,
    setStudentErrors,
    scheduleErrors,
    setScheduleErrors,
    estimatedStartDate,
    estimatedEndDate,
    hasErrors,
    isFormComplete,
    canActivate,
    isConfirmationOpen,
    setIsConfirmationOpen,
    isActivating,
    activationSuccess,
    errorMessage,
    activateModule,
  };
}
