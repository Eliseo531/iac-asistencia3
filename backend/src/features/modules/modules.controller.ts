import {
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '../../common/enums';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { StudentImportValidationResultDto } from './dto/import-validation-result.dto';
import { ScheduleValidationResultDto } from './dto/schedule-validation-result.dto';
import { ExcelValidationException } from './exceptions/excel-validation.exception';
import { ExcelParserService } from './services/excel-parser.service';
import { ScheduleParserService } from './services/schedule-parser.service';

@ApiTags('Modules')
@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('modules')
export class ModulesController {
  constructor(
    private readonly excelParserService: ExcelParserService,
    private readonly scheduleParserService: ScheduleParserService,
  ) {}

  @Post('import/students')
  @ApiOperation({
    summary: 'Importar y validar archivo Excel de estudiantes (RF-11, RN-02)',
    description:
      'Procesa un archivo .xlsx con las columnas "Número de registro", "Nombre completo" y "Correo electrónico". Valida obligatoriedad, formatos y unicidad de registros. Si contiene errores, los detalla por número de fila.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description:
            'Archivo Excel (.xlsx o .xls) con las columnas requeridas',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Archivo procesado y validado exitosamente sin errores.',
    type: StudentImportValidationResultDto,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'El archivo contiene errores de validación o duplicados.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado. Se requiere token JWT administrativo.',
  })
  @UseInterceptors(FileInterceptor('file'))
  async importStudents(
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<StudentImportValidationResultDto> {
    if (!file || !file.buffer) {
      throw new ExcelValidationException(
        'Debe seleccionar un archivo Excel válido para procesar',
      );
    }

    const result = await this.excelParserService.parseStudentsExcel(file.buffer);

    if (result.hasErrors) {
      throw new ExcelValidationException(
        `Se encontraron ${result.errorCount} errores en el archivo Excel de estudiantes`,
        result,
      );
    }

    return result;
  }

  @Post('import/schedules')
  @ApiOperation({
    summary: 'Importar y validar calendario de clases vía Excel (RF-12, RN-04)',
    description:
      'Procesa un archivo .xlsx con las columnas "Fecha", "Hora inicio" y "Hora fin". Valida formato de fecha, horas de 24h, coherencia temporal y unicidad de fecha. Horarios son informativos.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description:
            'Archivo Excel (.xlsx o .xls) con las columnas Fecha, Hora inicio y Hora fin',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Calendario procesado y validado exitosamente sin errores.',
    type: ScheduleValidationResultDto,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'El calendario contiene fechas repetidas o formatos de hora inválidos.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado. Se requiere token JWT administrativo.',
  })
  @UseInterceptors(FileInterceptor('file'))
  async importSchedules(
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ScheduleValidationResultDto> {
    if (!file || !file.buffer) {
      throw new ExcelValidationException(
        'Debe seleccionar un archivo Excel de calendario válido para procesar',
      );
    }

    const result = await this.scheduleParserService.parseSchedulesExcel(
      file.buffer,
    );

    if (result.hasErrors) {
      throw new ExcelValidationException(
        `Se encontraron ${result.errorCount} errores en el calendario de fechas de clase`,
        result,
      );
    }

    return result;
  }
}
