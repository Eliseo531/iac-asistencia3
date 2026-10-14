'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/features/auth/services/auth.service';
import { AuthUser } from '@/features/auth/types/auth.types';
import { StudentsService } from '@/features/students/services/students.service';
import {
  StudentFilterQuery,
  StudentListResponse,
} from '@/features/students/types/student.types';
import { StudentSearchBar } from '@/features/students/components/StudentSearchBar';
import { ActiveStudentsTable } from '@/features/students/components/ActiveStudentsTable';
import { LogoutConfirmButton } from '@/features/auth/components/LogoutConfirmButton';

export default function AdminStudentsDirectoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Estados de datos de estudiantes
  const [data, setData] = useState<StudentListResponse>({
    moduleName: 'Cargando módulo...',
    totalCount: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    students: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Verificar autenticación administrativa
  useEffect(() => {
    const storedUser = authService.getStoredUser();
    const storedToken = authService.getStoredToken();

    if (!storedToken) {
      router.push('/admin/login');
      return;
    }

    setUser(storedUser);
    setToken(storedToken);
    setIsLoadingAuth(false);
  }, [router]);

  // Función para consultar los estudiantes de la API
  const fetchStudents = useCallback(
    async (query: StudentFilterQuery, authToken: string) => {
      setIsFetching(true);
      setErrorMessage(null);
      try {
        const response = await StudentsService.getActiveModuleStudents(
          query,
          authToken,
        );
        setData(response);
      } catch (err: any) {
        setErrorMessage(
          err.message || 'No fue posible cargar el directorio de estudiantes.',
        );
      } finally {
        setIsFetching(false);
      }
    },
    [],
  );

  // Ejecutar consulta cuando cambie la búsqueda, página o token
  useEffect(() => {
    if (!token) return;

    fetchStudents(
      {
        search: searchTerm,
        page: currentPage,
        limit,
      },
      token,
    );
  }, [token, searchTerm, currentPage, limit, fetchStudents]);

  // Manejar cambio en la barra de búsqueda reactiva (debounce ya aplicado en el componente)
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Regresar a la primera página al buscar
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-zinc-500">Cargando directorio de estudiantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Barra de navegación superior */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="w-9 h-9 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-300 transition"
              title="Volver al Dashboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <span className="font-semibold text-base block leading-none">
                Directorio de Estudiantes
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Módulo Activo • Consulta y Búsqueda Reactiva (RF-06, US-10)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium leading-none">
                {user?.username || 'Administrador'}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {user?.email || 'admin@sistema.com'}
              </span>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-3.5 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition"
            >
              Dashboard
            </Link>
            <LogoutConfirmButton role="ADMIN" />
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Encabezado con información del Módulo Activo */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-zinc-900 text-white p-6 sm:p-8 shadow-lg shadow-indigo-700/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                  Nómina Oficial
                </span>
                {data.moduleCode && (
                  <span className="px-3 py-1 bg-indigo-500/30 border border-indigo-400/40 rounded-full text-xs font-mono font-bold text-indigo-200">
                    {data.moduleCode}
                  </span>
                )}
                <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-semibold text-emerald-300">
                  Módulo Activo (RN-01)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {data.moduleName}
              </h1>
              <p className="text-indigo-200 text-sm max-w-2xl">
                Consulta y filtra en tiempo real la nómina de estudiantes matriculados en el módulo académico actualmente en curso.
              </p>
            </div>

            {/* Tarjeta de métricas resumidas */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-5 flex items-center gap-5 shrink-0">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-indigo-200 block font-semibold">
                  Total Matriculados
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {data.totalCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de error si la consulta falla */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Barra de Búsqueda y Filtros */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex-1 max-w-xl">
              <StudentSearchBar
                value={searchTerm}
                onSearchChange={handleSearchChange}
                isLoading={isFetching}
                placeholder="Buscar por número de matrícula, nombre completo o correo (debounce 300ms)..."
              />
            </div>

            <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
              {searchTerm && (
                <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                  Filtrando por: <strong className="text-zinc-900 dark:text-zinc-100">&quot;{searchTerm}&quot;</strong>
                </span>
              )}
              <Link
                href="/admin/modulo/importar"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Importar más estudiantes</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tabla de Estudiantes */}
        <ActiveStudentsTable
          students={data.students}
          totalCount={data.totalCount}
          currentPage={data.page}
          totalPages={data.totalPages}
          limit={data.limit}
          onPageChange={handlePageChange}
          searchTerm={searchTerm}
          onClearSearch={() => handleSearchChange('')}
          isLoading={isFetching}
        />
      </main>
    </div>
  );
}
