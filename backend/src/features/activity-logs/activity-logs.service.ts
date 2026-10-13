import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';

@Injectable()
export class ActivityLogsService {
  private readonly logger = new Logger(ActivityLogsService.name);

  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  /**
   * Registra una acción inmutable en la bitácora de auditoría
   */
  async createLog(dto: CreateActivityLogDto): Promise<ActivityLog> {
    const log = this.activityLogRepository.create({
      moduleId: dto.moduleId ?? null,
      userId: dto.userId ?? null,
      userIdentifier: dto.userIdentifier,
      userRole: dto.userRole,
      action: dto.action,
      entityAffected: dto.entityAffected,
      entityId: dto.entityId ?? null,
      previousValue: dto.previousValue ?? null,
      newValue: dto.newValue ?? null,
      ipAddress: dto.ipAddress ?? null,
    });

    const savedLog = await this.activityLogRepository.save(log);

    this.logger.log(
      `[Audit] Acción ${dto.action} registrada por ${dto.userIdentifier} (${dto.userRole}) sobre ${dto.entityAffected}`,
    );

    return savedLog;
  }

  /**
   * Consulta el historial de auditoría de un módulo específico
   */
  async findByModule(moduleId: string): Promise<ActivityLog[]> {
    return this.activityLogRepository.find({
      where: { moduleId },
      order: { createdAt: 'DESC' },
    });
  }
}
