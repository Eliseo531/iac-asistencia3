import { RowValidationError, StudentRow } from './module-import.types';
import { ScheduleRow } from './schedule-import.types';

export interface ModulePreviewSummary {
  isValid: boolean;
  canActivate: boolean;
  totalStudents: number;
  totalSchedules: number;
  estimatedStartDate: string;
  estimatedEndDate: string;
  studentsPreview: StudentRow[];
  schedulesPreview: ScheduleRow[];
  validationErrors: {
    studentsErrors: RowValidationError[];
    schedulesErrors: RowValidationError[];
  };
}

export interface ModuleMetadata {
  name: string;
  code: string;
  description?: string;
}
