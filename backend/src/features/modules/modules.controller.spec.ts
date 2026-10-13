import { Test, TestingModule } from '@nestjs/testing';
import { ModulesController } from './modules.controller';
import { ExcelParserService } from './services/excel-parser.service';
import { ExcelValidationException } from './exceptions/excel-validation.exception';

describe('ModulesController', () => {
  let controller: ModulesController;
  let excelParserService: ExcelParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModulesController],
      providers: [
        {
          provide: ExcelParserService,
          useValue: {
            parseStudentsExcel: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ModulesController>(ModulesController);
    excelParserService = module.get<ExcelParserService>(ExcelParserService);
  });

  it('debe lanzar ExcelValidationException si no se envía ningún archivo', async () => {
    await expect(controller.importStudents(undefined)).rejects.toThrow(
      ExcelValidationException,
    );
  });

  it('debe retornar resultado si el archivo es válido y no contiene errores', async () => {
    const mockFile = {
      buffer: Buffer.from('test'),
      originalname: 'estudiantes.xlsx',
    } as Express.Multer.File;

    const mockResult = {
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
      ],
    };

    jest
      .spyOn(excelParserService, 'parseStudentsExcel')
      .mockResolvedValue(mockResult);

    const response = await controller.importStudents(mockFile);
    expect(response).toEqual(mockResult);
  });

  it('debe lanzar ExcelValidationException si el archivo contiene errores por fila (RF-11)', async () => {
    const mockFile = {
      buffer: Buffer.from('test'),
      originalname: 'estudiantes.xlsx',
    } as Express.Multer.File;

    const mockResult = {
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

    jest
      .spyOn(excelParserService, 'parseStudentsExcel')
      .mockResolvedValue(mockResult);

    await expect(controller.importStudents(mockFile)).rejects.toThrow(
      ExcelValidationException,
    );
  });
});
