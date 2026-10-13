import { Test, TestingModule } from '@nestjs/testing';
import { ModulesService } from './modules.service';
import { ExcelParserService } from './excel-parser.service';
import { ScheduleParserService } from './schedule-parser.service';
import { ExcelValidationException } from '../exceptions/excel-validation.exception';

describe('ModulesService', () => {
  let service: ModulesService;
  let excelParserService: ExcelParserService;
  let scheduleParserService: ScheduleParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModulesService,
        {
          provide: ExcelParserService,
          useValue: {
            parseStudentsExcel: jest.fn(),
          },
        },
        {
          provide: ScheduleParserService,
          useValue: {
            parseSchedulesExcel: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ModulesService>(ModulesService);
    excelParserService = module.get<ExcelParserService>(ExcelParserService);
    scheduleParserService = module.get<ScheduleParserService>(
      ScheduleParserService,
    );
  });

  it('debe lanzar excepción si falta alguno de los buffers', async () => {
    await expect(
      service.previewModuleData(undefined, Buffer.from('test')),
    ).rejects.toThrow(ExcelValidationException);

    await expect(
      service.previewModuleData(Buffer.from('test'), undefined),
    ).rejects.toThrow(ExcelValidationException);
  });

  it('debe generar vista previa consolidada exitosa cuando ambos archivos son correctos (RF-16)', async () => {
    const mockStudentsResult = {
      totalRows: 2,
      validRowsCount: 2,
      errorCount: 0,
      hasErrors: false,
      errors: [],
      data: [
        {
          registrationNumber: '1001',
          fullName: 'Juan Pérez',
          email: 'juan@gmail.com',
          rowNumber: 2,
        },
        {
          registrationNumber: '1002',
          fullName: 'María López',
          email: 'maria@gmail.com',
          rowNumber: 3,
        },
      ],
    };

    const mockSchedulesResult = {
      totalSessions: 2,
      hasErrors: false,
      errorCount: 0,
      errors: [],
      schedules: [
        {
          classDate: '2026-10-05',
          startTime: '18:00',
          endTime: '21:00',
          rowNumber: 2,
        },
        {
          classDate: '2026-10-07',
          startTime: '18:00',
          endTime: '21:00',
          rowNumber: 3,
        },
      ],
    };

    jest
      .spyOn(excelParserService, 'parseStudentsExcel')
      .mockResolvedValue(mockStudentsResult);
    jest
      .spyOn(scheduleParserService, 'parseSchedulesExcel')
      .mockResolvedValue(mockSchedulesResult);

    const result = await service.previewModuleData(
      Buffer.from('students'),
      Buffer.from('schedules'),
    );

    expect(result.isValid).toBe(true);
    expect(result.canActivate).toBe(true);
    expect(result.totalStudents).toBe(2);
    expect(result.totalSchedules).toBe(2);
    expect(result.estimatedStartDate).toBe('2026-10-05');
    expect(result.estimatedEndDate).toBe('2026-10-07');
    expect(result.studentsPreview).toHaveLength(2);
    expect(result.schedulesPreview).toHaveLength(2);
  });

  it('debe marcar canActivate como false si alguno de los archivos contiene errores', async () => {
    const mockStudentsResult = {
      totalRows: 2,
      validRowsCount: 1,
      errorCount: 1,
      hasErrors: true,
      errors: [
        {
          row: 3,
          field: 'registrationNumber',
          value: '1001',
          message: 'Duplicado',
        },
      ],
      data: [],
    };

    const mockSchedulesResult = {
      totalSessions: 1,
      hasErrors: false,
      errorCount: 0,
      errors: [],
      schedules: [
        {
          classDate: '2026-10-05',
          startTime: '18:00',
          endTime: '21:00',
          rowNumber: 2,
        },
      ],
    };

    jest
      .spyOn(excelParserService, 'parseStudentsExcel')
      .mockResolvedValue(mockStudentsResult);
    jest
      .spyOn(scheduleParserService, 'parseSchedulesExcel')
      .mockResolvedValue(mockSchedulesResult);

    const result = await service.previewModuleData(
      Buffer.from('students'),
      Buffer.from('schedules'),
    );

    expect(result.isValid).toBe(false);
    expect(result.canActivate).toBe(false);
    expect(result.validationErrors.studentsErrors).toHaveLength(1);
  });
});
