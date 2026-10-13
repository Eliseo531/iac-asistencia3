import { Inject } from '@nestjs/common';

jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: (entity: any) => Inject(`${entity.name}Repository`),
  getRepositoryToken: (entity: any) => `${entity.name}Repository`,
}));

import { Test, TestingModule } from '@nestjs/testing';
const getRepositoryToken = (entity: any) => `${entity.name}Repository`;
import { AttendancesService } from './attendances.service';
import { Attendance } from './entities/attendance.entity';
import { ClassSchedule } from '../schedules/entities/class-schedule.entity';
import { AcademicModule } from '../modules/entities/academic-module.entity';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { NotClassDayException } from './exceptions/not-class-day.exception';
import { AlreadyMarkedAttendanceException } from './exceptions/already-marked-attendance.exception';
import { AttendanceStatus } from '../../common/enums';

describe('AttendancesService', () => {
  let service: AttendancesService;
  let attendanceRepo: any;
  let scheduleRepo: any;
  let moduleRepo: any;
  let activityLogsService: any;

  const mockAttendanceRepo = {
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((att) =>
      Promise.resolve({
        id: 'mock-att-uuid-1',
        ...att,
        markedAt: new Date(),
      }),
    ),
  };

  const mockQueryBuilder = {
    innerJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const mockScheduleRepo = {
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockModuleRepo = {
    findOne: jest.fn(),
  };

  const mockActivityLogsService = {
    createLog: jest.fn().mockResolvedValue({ id: 'mock-log-1' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendancesService,
        {
          provide: getRepositoryToken(Attendance),
          useValue: mockAttendanceRepo,
        },
        {
          provide: getRepositoryToken(ClassSchedule),
          useValue: mockScheduleRepo,
        },
        {
          provide: getRepositoryToken(AcademicModule),
          useValue: mockModuleRepo,
        },
        {
          provide: ActivityLogsService,
          useValue: mockActivityLogsService,
        },
      ],
    }).compile();

    service = module.get<AttendancesService>(AttendancesService);
    attendanceRepo = mockAttendanceRepo;
    scheduleRepo = mockScheduleRepo;
    moduleRepo = mockModuleRepo;
    activityLogsService = mockActivityLogsService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('getTodayStatus', () => {
    it('debe indicar hasClassToday=true y alreadyMarked=false si hay clase hoy y el alumno aun no marco', async () => {
      const today = new Date().toISOString().split('T')[0];
      scheduleRepo.findOne.mockResolvedValue({
        id: 'schedule-today-id',
        classDate: today,
        startTime: '18:00',
        endTime: '21:00',
      });
      attendanceRepo.findOne.mockResolvedValue(null);

      const result = await service.getTodayStatus('student-1', 'module-1');

      expect(result.hasClassToday).toBe(true);
      expect(result.alreadyMarked).toBe(false);
      expect(result.classSchedule?.id).toBe('schedule-today-id');
    });

    it('debe indicar alreadyMarked=true si el alumno ya tiene registro previo hoy', async () => {
      const today = new Date().toISOString().split('T')[0];
      scheduleRepo.findOne.mockResolvedValue({
        id: 'schedule-today-id',
        classDate: today,
        startTime: '18:00',
        endTime: '21:00',
      });
      attendanceRepo.findOne.mockResolvedValue({
        id: 'attendance-id-1',
        markedAt: new Date(),
        status: AttendanceStatus.PRESENTE,
      });

      const result = await service.getTodayStatus('student-1', 'module-1');

      expect(result.hasClassToday).toBe(true);
      expect(result.alreadyMarked).toBe(true);
      expect(result.attendance?.status).toBe(AttendanceStatus.PRESENTE);
    });

    it('debe retornar hasClassToday=false si hoy no coincide con fecha de clase', async () => {
      scheduleRepo.findOne.mockResolvedValue(null);
      mockQueryBuilder.getOne.mockResolvedValue({
        id: 'next-schedule-id',
        classDate: '2026-10-20',
        startTime: '18:00',
        endTime: '21:00',
      });

      const result = await service.getTodayStatus('student-1', 'module-1');

      expect(result.hasClassToday).toBe(false);
      expect(result.classSchedule).toBeNull();
      expect(result.nextScheduledClass?.classDate).toBe('2026-10-20');
    });
  });

  describe('checkIn', () => {
    it('debe registrar asistencia y auditar evento si hoy es dia de clase y no ha marcado previamente', async () => {
      const today = new Date().toISOString().split('T')[0];
      mockQueryBuilder.getOne.mockResolvedValue({
        id: 'schedule-today-id',
        classDate: today,
      });
      attendanceRepo.findOne.mockResolvedValue(null);

      const result = await service.checkIn(
        'student-1',
        'module-1',
        { registrationNumber: '1001', fullName: 'Juan Pérez' },
        '127.0.0.1',
      );

      expect(attendanceRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          studentId: 'student-1',
          classScheduleId: 'schedule-today-id',
          status: AttendanceStatus.PRESENTE,
        }),
      );
      expect(attendanceRepo.save).toHaveBeenCalled();
      expect(activityLogsService.createLog).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 'mock-att-uuid-1');
    });

    it('debe lanzar NotClassDayException si hoy no hay clase en el modulo activo (RN-04)', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);

      await expect(
        service.checkIn('student-1', 'module-1', { registrationNumber: '1001' }),
      ).rejects.toThrow(NotClassDayException);
    });

    it('debe lanzar AlreadyMarkedAttendanceException si ya marco previamente (RN-03)', async () => {
      const today = new Date().toISOString().split('T')[0];
      mockQueryBuilder.getOne.mockResolvedValue({
        id: 'schedule-today-id',
        classDate: today,
      });
      attendanceRepo.findOne.mockResolvedValue({
        id: 'already-marked-id',
        markedAt: new Date(),
      });

      await expect(
        service.checkIn('student-1', 'module-1', { registrationNumber: '1001' }),
      ).rejects.toThrow(AlreadyMarkedAttendanceException);
    });
  });
});
