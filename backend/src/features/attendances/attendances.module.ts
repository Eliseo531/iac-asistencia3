import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { ClassSchedule } from '../schedules/entities/class-schedule.entity';
import { AcademicModule } from '../modules/entities/academic-module.entity';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { StudentJwtGuard } from '../../common/guards/student-jwt.guard';
import { JwtService } from '../../common/services/jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance, ClassSchedule, AcademicModule]),
    ActivityLogsModule,
  ],
  controllers: [AttendancesController],
  providers: [AttendancesService, StudentJwtGuard, JwtService],
  exports: [AttendancesService],
})
export class AttendancesModule {}
