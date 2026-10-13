import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../students/entities/student.entity';
import { AcademicModule } from '../modules/entities/academic-module.entity';
import { AdminUser } from './entities/admin-user.entity';
import { StudentAuthService } from './student-auth.service';
import { StudentAuthController } from './student-auth.controller';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { JwtService } from '../../common/services/jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, AcademicModule, AdminUser]),
    ActivityLogsModule,
  ],
  controllers: [StudentAuthController],
  providers: [StudentAuthService, JwtService],
  exports: [StudentAuthService, JwtService],
})
export class AuthModule {}
