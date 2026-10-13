import { Injectable, Logger } from '@nestjs/common';
import { ModulePreviewSummaryDto } from '../dto/module-preview-summary.dto';
import { ExcelValidationException } from '../exceptions/excel-validation.exception';
import { ExcelParserService } from './excel-parser.service';
import { ScheduleParserService } from './schedule-parser.service';

@Injectable()
export class ModulesService {
  private readonly logger = new Logger(ModulesService.name);

  constructor(
    private readonly excelParserService: ExcelParserService,
    private readonly scheduleParserService: ScheduleParserService,
  ) {}

  /**
   * Consolida y valida simultáneamente los archivos de estudiantes y calendario para previsualización (RF-16, US-06)
   */
  async previewModuleData(
    studentsBuffer?: Buffer,
    schedulesBuffer?: Buffer,
  ): Promise<ModulePreviewSummaryDto> {
    this.logger.log('Generando vista previa consolidada de nuevo módulo académico...');

    if (!studentsBuffer || studentsBuffer.length === 0) {
      throw new ExcelValidationException(
        'El archivo de nómina de estudiantes es obligatorio para la vista previa',
      );
    }

    if (!schedulesBuffer || schedulesBuffer.length === 0) {
      throw new ExcelValidationException(
        'El archivo de calendario de clases es obligatorio para la vista previa',
      );
    }

    // 1. Procesar archivo de estudiantes
    const studentsResult = await this.excelParserService.parseStudentsExcel(
      studentsBuffer,
    );

    // 2. Procesar archivo de calendario de clases
    const schedulesResult = await this.scheduleParserService.parseSchedulesExcel(
      schedulesBuffer,
    );

    const hasAnyError = studentsResult.hasErrors || schedulesResult.hasErrors;
    const canActivate =
      !hasAnyError &&
      studentsResult.validRowsCount > 0 &&
      schedulesResult.schedules.length > 0;

    const schedules = schedulesResult.schedules || [];
    const estimatedStartDate = schedules.length > 0 ? schedules[0].classDate : '';
    const estimatedEndDate =
      schedules.length > 0 ? schedules[schedules.length - 1].classDate : '';

    this.logger.log(
      `Vista previa generada: ${studentsResult.validRowsCount} estudiantes, ${schedules.length} clases. Habilitado para activar: ${canActivate}`,
    );

    return {
      isValid: !hasAnyError,
      canActivate,
      totalStudents: studentsResult.validRowsCount,
      totalSchedules: schedules.length,
      estimatedStartDate,
      estimatedEndDate,
      studentsPreview: studentsResult.data,
      schedulesPreview: schedules,
      validationErrors: {
        studentsErrors: studentsResult.errors,
        schedulesErrors: schedulesResult.errors,
      },
    };
  }
}
