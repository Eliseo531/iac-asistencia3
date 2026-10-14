import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import {
  AcademicModule,
  Student,
  ClassSchedule,
  Attendance,
  AdminUser,
  ActivityLog,
  APP_ENTITIES,
} from '../entities';
import {
  ModuleStatus,
  AttendanceStatus,
  UserRole,
  ActivityAction,
} from '../../common/enums';

// Cargar variables de entorno
dotenv.config();

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export async function runSeed() {
  console.log('🌱 [Paso Cero] Iniciando script de semilla (Database Seed)...');

  const isLocal =
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.includes('localhost') ||
    process.env.DATABASE_URL.includes('127.0.0.1');
  const enableSsl =
    process.env.DB_SSL === 'true' || (!isLocal && !!process.env.DATABASE_URL);
  const sslConfig = enableSsl ? { rejectUnauthorized: false } : false;

  const dataSource = process.env.DATABASE_URL
    ? new DataSource({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: APP_ENTITIES,
        synchronize: true,
        ssl: sslConfig,
      })
    : new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'asistencia_db',
        entities: APP_ENTITIES,
        synchronize: true,
        ssl: sslConfig,
      });

  await dataSource.initialize();
  console.log('✅ Conexión a la base de datos establecida.');

  const adminRepo = dataSource.getRepository(AdminUser);
  const moduleRepo = dataSource.getRepository(AcademicModule);
  const studentRepo = dataSource.getRepository(Student);
  const scheduleRepo = dataSource.getRepository(ClassSchedule);
  const attendanceRepo = dataSource.getRepository(Attendance);
  const logRepo = dataSource.getRepository(ActivityLog);

  // 1. Limpieza segura de datos previos de desarrollo
  console.log('🧹 Limpiando datos previos de desarrollo...');
  await dataSource.query(
    'TRUNCATE TABLE attendances, activity_logs, class_schedules, students, academic_modules, admin_users CASCADE',
  );

  // 2. Crear Administrador por Defecto (RF-02)
  console.log('👤 Creando usuario Administrador...');
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('admin123', saltRounds);

  const admin = adminRepo.create({
    username: 'admin',
    email: 'admin@sistema.com',
    passwordHash,
    role: UserRole.ADMIN,
    isActive: true,
  });
  await adminRepo.save(admin);
  console.log('   ↳ Admin creado: admin@sistema.com (clave: admin123)');

  // 3. Crear Módulo Académico Activo (RN-01, RF-13)
  console.log('📚 Creando Módulo Académico ACTIVO...');
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 10);
  const endDate = new Date();
  endDate.setDate(today.getDate() + 20);

  const academicModule = moduleRepo.create({
    name: 'Módulo Piloto: DevOps & Infraestructura como Código',
    code: 'DCID-V1E1-M2',
    status: ModuleStatus.ACTIVE,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  });
  const savedModule = await moduleRepo.save(academicModule);
  console.log(`   ↳ Módulo activo creado: [${savedModule.code}] ${savedModule.name}`);

  // 4. Crear 3 Estudiantes Vinculados al Módulo (RF-01, RN-02)
  console.log('🎓 Creando Estudiantes matriculados en el módulo activo...');
  const studentsData = [
    { registrationNumber: '1001', fullName: 'Juan Pérez', email: 'juan@gmail.com' },
    { registrationNumber: '1002', fullName: 'María López', email: 'maria@gmail.com' },
    { registrationNumber: '1003', fullName: 'Carlos Ruiz', email: 'carlos@gmail.com' },
  ];

  const savedStudents: Student[] = [];
  for (const item of studentsData) {
    const student = studentRepo.create({
      moduleId: savedModule.id,
      registrationNumber: item.registrationNumber,
      fullName: item.fullName,
      email: item.email,
    });
    savedStudents.push(await studentRepo.save(student));
  }
  console.log(`   ↳ ${savedStudents.length} estudiantes matriculados.`);

  // 5. Crear Fechas de Clase (Pasadas, Hoy y Futuras) (RF-12, RN-04)
  console.log('📅 Creando Calendario de Clases (Pasadas, Hoy y Futuras)...');
  const pastDate1 = new Date();
  pastDate1.setDate(today.getDate() - 5);

  const pastDate2 = new Date();
  pastDate2.setDate(today.getDate() - 2);

  const futureDate1 = new Date();
  futureDate1.setDate(today.getDate() + 2);

  const futureDate2 = new Date();
  futureDate2.setDate(today.getDate() + 5);

  const schedulesData = [
    { classDate: formatDate(pastDate1), startTime: '18:00', endTime: '21:00' },
    { classDate: formatDate(pastDate2), startTime: '18:00', endTime: '21:00' },
    { classDate: formatDate(today), startTime: '18:00', endTime: '21:00' }, // FECHA DE HOY (habilita botón para US-08)
    { classDate: formatDate(futureDate1), startTime: '18:00', endTime: '21:00' },
    { classDate: formatDate(futureDate2), startTime: '18:00', endTime: '21:00' },
  ];

  const savedSchedules: ClassSchedule[] = [];
  for (const item of schedulesData) {
    const schedule = scheduleRepo.create({
      moduleId: savedModule.id,
      classDate: item.classDate,
      startTime: item.startTime,
      endTime: item.endTime,
    });
    savedSchedules.push(await scheduleRepo.save(schedule));
  }
  console.log(`   ↳ ${savedSchedules.length} fechas de clase programadas (incluyendo la fecha de hoy: ${formatDate(today)}).`);

  // 6. Asistencia de prueba para fechas pasadas (para probar historial y faltas - US-09)
  console.log('📝 Creando marcas de asistencia de prueba para fechas pasadas...');
  // Juan Pérez presente en pastDate1
  const attendance1 = attendanceRepo.create({
    studentId: savedStudents[0].id,
    classScheduleId: savedSchedules[0].id,
    status: AttendanceStatus.PRESENTE,
    markedAt: pastDate1,
    markedByRole: UserRole.STUDENT,
  });
  await attendanceRepo.save(attendance1);
  console.log('   ↳ Asistencia registrada: Juan Pérez asistió a clase pasada.');

  // 7. Registro de Auditoría Inicial (RF-09, US-14)
  console.log('🛡️ Registrando evento inicial en log de auditoría...');
  const initialLog = logRepo.create({
    moduleId: savedModule.id,
    userId: admin.id,
    userIdentifier: admin.username,
    userRole: UserRole.ADMIN,
    action: ActivityAction.ACTIVATE_MODULE,
    entityAffected: 'AcademicModule',
    entityId: savedModule.id,
    newValue: { code: savedModule.code, name: savedModule.name, status: savedModule.status },
    ipAddress: '127.0.0.1',
  });
  await logRepo.save(initialLog);
  console.log('   ↳ Evento de activación registrado en auditoría.');

  console.log('\n🎉 [Paso Cero Completado con Éxito]');
  console.log('Ambos programadores tienen la base de datos lista para trabajar en paralelo:');
  console.log('  - Programador 1 puede usar el admin y trabajar en los importadores de Excel.');
  console.log('  - Programador 2 puede iniciar sesión con "1001" o "juan@gmail.com" y probar la marcación de HOY.');

  await dataSource.destroy();
}

// Ejecutar si se invoca directamente
if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Error al ejecutar el seed:', err);
      process.exit(1);
    });
}
