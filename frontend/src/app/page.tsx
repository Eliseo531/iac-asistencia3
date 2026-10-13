import Link from 'next/link';

export const metadata = {
  title: 'Sistema de Asistencia | Portal Principal',
  description: 'Plataforma para el registro y control de asistencias por módulos',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-indigo-50/20 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <span>Diplomado DevOps • Módulo 2 IaC</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sistema Web de Registro y Control de Asistencia
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
            Plataforma institucional para el registro y gestión de asistencias en módulos de postgrado.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <Link
            href="/admin/login"
            className="group p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-indigo-500 dark:hover:border-indigo-500 transition-all text-left flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-1">
                Administración
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Iniciar sesión con credenciales administrativas para gestionar módulos, estudiantes y calendarios (US-01).
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Ingresar como Admin →
            </span>
          </Link>

          <Link
            href="/login"
            className="group p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 transition-all text-left flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-1">
                Portal Estudiantes
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Acceso sin contraseña mediante número de registro o correo para marcar asistencia en fecha activa (US-02).
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Ingresar como Alumno →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
