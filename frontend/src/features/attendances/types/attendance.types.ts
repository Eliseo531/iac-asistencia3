export interface ClassScheduleSummary {
  id: string;
  classDate: string;
  startTime: string;
  endTime: string;
}

export interface AttendanceRecord {
  id: string;
  markedAt: string;
  status: 'PRESENTE' | 'FALTA';
}

export interface TodayStatusData {
  hasClassToday: boolean;
  classSchedule: ClassScheduleSummary | null;
  alreadyMarked: boolean;
  attendance: AttendanceRecord | null;
  nextScheduledClass?: ClassScheduleSummary | null;
}
