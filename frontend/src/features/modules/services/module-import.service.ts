import { StudentImportValidationResult } from '../types/module-import.types';
import { ScheduleValidationResult } from '../types/schedule-import.types';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface ImportStudentsResponse {
  success: boolean;
  message: string;
  data?: StudentImportValidationResult;
  errorData?: StudentImportValidationResult;
}

export interface ImportSchedulesResponse {
  success: boolean;
  message: string;
  data?: ScheduleValidationResult;
  errorData?: ScheduleValidationResult;
}

export class ModuleImportService {
  /**
   * Envía el archivo Excel de estudiantes al backend para su validación (RF-11, RN-02)
   */
  static async importStudents(
    file: File,
    token: string,
  ): Promise<ImportStudentsResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/modules/import/students`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const json = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message:
            json.message ||
            'El archivo contiene errores de validación que deben corregirse.',
          errorData: json.data,
        };
      }

      return {
        success: true,
        message: json.message || 'Nómina de estudiantes validada exitosamente.',
        data: json.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          'Error de conexión con el servidor. Verifique que la API esté activa.',
      };
    }
  }

  /**
   * Envía el archivo Excel de calendario al backend para su validación (RF-12, RN-04)
   */
  static async importSchedules(
    file: File,
    token: string,
  ): Promise<ImportSchedulesResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/modules/import/schedules`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const json = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message:
            json.message ||
            'El calendario contiene errores o fechas duplicadas que deben corregirse.',
          errorData: json.data,
        };
      }

      return {
        success: true,
        message:
          json.message ||
          'Calendario de clases procesado y validado exitosamente.',
        data: json.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          'Error de conexión con el servidor. Verifique que la API esté activa.',
      };
    }
  }
}
