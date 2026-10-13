import { apiClient } from '../../../lib/api-client';
import {
  AttendanceRecord,
  TodayStatusData,
} from '../types/attendance.types';

export const attendanceService = {
  /**
   * Consulta el estado de la sesión de hoy (RF-03, US-08)
   */
  async getTodayStatus(): Promise<TodayStatusData> {
    return apiClient<TodayStatusData>('/attendances/today-status');
  },

  /**
   * Registra la asistencia en tiempo real (RN-03, RN-04, US-08)
   */
  async checkIn(): Promise<AttendanceRecord> {
    return apiClient<AttendanceRecord>('/attendances/check-in', {
      method: 'POST',
    });
  },
};
