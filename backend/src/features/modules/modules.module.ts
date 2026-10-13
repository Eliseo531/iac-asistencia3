import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicModule } from './entities/academic-module.entity';
import { Student } from '../students/entities/student.entity';
import { ModulesController } from './modules.controller';
import { ExcelParserService } from './services/excel-parser.service';

@Module({
  imports: [TypeOrmModule.forFeature([AcademicModule, Student])],
  controllers: [ModulesController],
  providers: [ExcelParserService],
  exports: [ExcelParserService],
})
export class ModulesModule {}
