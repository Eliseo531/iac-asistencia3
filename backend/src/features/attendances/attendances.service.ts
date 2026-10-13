import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { ClassSchedule } from '../schedules/entities/class-schedule.entity';
import { AcademicModule } from '../modules/entities/academic-module.entity';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { TodayStatusResponseDto } from './dto/today-status.dto';
import { NotClassDayException } from './exceptions/not-class-day.exception';
import { AlreadyMarkedAttendanceException } from './exceptions/already-marked-attendance.exception';
import {
  ActivityAction,
  AttendanceStatus,
  ModuleStatus,
  UserRole,
} from '../../common/enums';

@Injectable()
export class AttendancesService {
  private readonly logger = new Logger(AttendancesService.name);

  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(ClassSchedule)
    private readonly scheduleRepository: Repository<ClassSchedule>,
    @InjectRepository(AcademicModule)
    private readonly moduleRepository: Repository<AcademicModule>,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  /**
   * Obtiene la fecha actual en formato YYYY-MM-DD
   */
  private getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Consulta el estado de clase y marcación del estudiante para el día de hoy (RF-03, US-08)
   */
  async getTodayStatus(
    studentId: string,
    moduleId: string,
  ): Promise<TodayStatusResponseDto> {
    const today = this.getTodayString();

    // 1. Buscar si hay clase programada hoy para el módulo
    const todaySchedule = await this.scheduleRepository.findOne({
      where: { moduleId, classDate: today },
    });

    if (!todaySchedule) {
      // Buscar la próxima clase programada posterior a hoy
      const nextClass = await this.scheduleRepository
        .createQueryBuilder('schedule')
        .where('schedule.moduleId = :moduleId', { moduleId })
        .andWhere('schedule.classDate > :today', { today })
        .orderBy('schedule.classDate', 'ASC')
        .getOne();

      return {
        hasClassToday: false,
        classSchedule: null,
        alreadyMarked: false,
        attendance: null,
        nextScheduledClass: nextClass
          ? {
              id: nextClass.id,
              classDate: nextClass.classDate,
              startTime: nextClass.startTime,
              endTime: nextClass.endTime,
            }
          : null,
      };
    }

    // 2. Verificar si el estudiante ya registró asistencia para la clase de hoy
    const attendance = await this.attendanceRepository.findOne({
      where: {
        studentId,
        classScheduleId: todaySchedule.id,
      },
    });

    return {
      hasClassToday: true,
      classSchedule: {
        id: todaySchedule.id,
        classDate: todaySchedule.classDate,
        startTime: todaySchedule.startTime,
        endTime: todaySchedule.endTime,
      },
      alreadyMarked: !!attendance,
      attendance: attendance
        ? {
            id: attendance.id,
            markedAt: attendance.markedAt,
            status: attendance.status,
          }
        : null,
      nextScheduledClass: null,
    };
  }

  /**
   * Registra la asistencia en tiempo real para el estudiante en la fecha de hoy (RN-03, RN-04, US-08)
   */
  async checkIn(
    studentId: string,
    moduleId: string,
    userMeta: {
      registrationNumber?: string;
      fullName?: string;
      email?: string;
    },
    ipAddress?: string,
  ): Promise<Attendance> {
    const today = this.getTodayString();
    this.logger.log(
      `Intento de marcación para estudiante ${studentId} en fecha ${today}`,
    );

    // 1. Validar que la fecha actual corresponda a una clase programada del módulo activo (RN-04)
    const schedule = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .innerJoin('schedule.module', 'module')
      .where('module.id = :moduleId', { moduleId })
      .andWhere('module.status = :status', { status: ModuleStatus.ACTIVE })
      .andWhere('schedule.classDate = :today', { today })
      .getOne();

    if (!schedule) {
      this.logger.warn(
        `Marcación rechazada: Hoy (${today}) no es un día de clase programado en el módulo activo.`,
      );
      throw new NotClassDayException(today);
    }

    // 2. Validar que no exista marcación previa del estudiante hoy (RN-03)
    const existingAttendance = await this.attendanceRepository.findOne({
      where: {
        studentId,
        classScheduleId: schedule.id,
      },
    });

    if (existingAttendance) {
      this.logger.warn(
        `Marcación rechazada: El estudiante ${studentId} ya tiene registro para la clase de hoy.`,
      );
      throw new AlreadyMarkedAttendanceException(existingAttendance.markedAt ?? today);
    }

    // 3. Registrar la asistencia con la hora exacta UTC del servidor
    const now = new Date();
    const attendance = this.attendanceRepository.create({
      studentId,
      classScheduleId: schedule.id,
      status: AttendanceStatus.PRESENTE,
      markedAt: now,
      markedByRole: UserRole.STUDENT,
    });

    const savedAttendance = await this.attendanceRepository.save(attendance);

    // 4. Registrar evento inmutable en el log de auditoría (RF-09, RN-07)
    const identifier = `${userMeta.registrationNumber || ''} - ${
      userMeta.fullName || userMeta.email || 'Estudiante'
    }`.trim();

    await this.activityLogsService.createLog({
      moduleId,
      userId: studentId,
      userIdentifier: identifier,
      userRole: UserRole.STUDENT,
      action: ActivityAction.MARK_ATTENDANCE,
      entityAffected: 'Attendance',
      entityId: savedAttendance.id,
      newValue: {
        classScheduleId: schedule.id,
        classDate: schedule.classDate,
        markedAt: savedAttendance.markedAt,
        status: savedAttendance.status,
      },
      ipAddress: ipAddress ?? null,
    });

    this.logger.log(
      `Asistencia registrada exitosamente para ${identifier} a las ${now.toISOString()}`,
    );

    return savedAttendance;
  }
}
