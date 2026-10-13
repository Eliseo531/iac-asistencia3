import { Metadata } from 'next';
import AdminLoginForm from '@/features/auth/components/AdminLoginForm';

export const metadata: Metadata = {
  title: 'Acceso Administrativo | Sistema de Control de Asistencia',
  description:
    'Inicio de sesión para administradores del sistema de control de asistencias.',
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-indigo-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex flex-col justify-center items-center p-4 sm:p-6">
      <AdminLoginForm />
    </div>
  );
}
