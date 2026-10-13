import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { APP_ENTITIES } from '../database/entities';

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'asistencia_db',
  entities: APP_ENTITIES,
  synchronize: process.env.DB_SYNCHRONIZE === 'true' || process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});
