import { StudentLoginForm } from '@/features/auth/components/StudentLoginForm';

export const metadata = {
  title: 'Sistema de Asistencia | Portal del Estudiante',
  description: 'Registro y consulta de asistencia académica por módulos',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100 flex items-center justify-center p-4">
      <StudentLoginForm />
    </main>
  );
}
