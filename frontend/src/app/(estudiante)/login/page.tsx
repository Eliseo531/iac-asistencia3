import { StudentLoginForm } from '@/features/auth/components/StudentLoginForm';

export const metadata = {
  title: 'Acceso de Estudiantes | Sistema de Asistencia',
  description: 'Portal de registro e historial de asistencia para estudiantes',
};

export default function StudentLoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100 flex items-center justify-center p-4">
      <StudentLoginForm />
    </main>
  );
}
