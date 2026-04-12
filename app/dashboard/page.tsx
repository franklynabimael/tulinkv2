"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading, logout, isTrialActive, trialDaysRemaining } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <i className="fas fa-circle-notch fa-spin text-4xl text-[#2ECC71] mb-4"></i>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Redirect handled by useEffect
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2ECC71] to-[#27ae60] rounded-xl flex items-center justify-center shadow-lg shadow-[#2ECC71]/30 transition-transform duration-300 group-hover:scale-105">
                <i className="fas fa-link text-white"></i>
              </div>
              <span className="text-xl font-bold text-gray-900">TuLink</span>
            </Link>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2ECC71]/20 to-[#2ECC71]/10 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-[#2ECC71]"></i>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {profile?.name || user.email}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary px-6 py-3 text-sm"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Bienvenido, <span className="text-[#2ECC71]">{profile?.name || user.email}</span>
          </h1>
          <p className="text-lg text-gray-600">
            Tu catálogo virtual está listo para configurar
          </p>
        </div>

        {/* Trial Status Card */}
        <div className="card-surface p-6 sm:p-8 mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2ECC71]/20 to-[#2ECC71]/10 rounded-2xl flex items-center justify-center">
                <i className={`fas fa-${isTrialActive ? "check-circle" : "exclamation-triangle"} text-2xl text-[#2ECC71]`}></i>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {isTrialActive ? "Prueba gratuita activa" : "Prueba finalizada"}
                </h2>
                {isTrialActive ? (
                  <div>
                    <p className="text-gray-600">
                      Te quedan <span className="font-bold text-[#2ECC71]">{trialDaysRemaining}</span> días de prueba gratis
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Disfruta de todas las funcionalidades sin costo
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    Tu período de prueba ha finalizado. Actualiza tu plan para continuar.
                  </p>
                )}
              </div>
            </div>
            {!isTrialActive && (
              <button className="btn-primary px-6 py-3 text-sm">
                <i className="fas fa-crown mr-2"></i>
                Actualizar plan
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Action Card 1 */}
          <div className="card-surface p-6 card-hover cursor-pointer group">
            <div className="icon-squircle mb-4 group-hover:scale-110 transition-transform">
              <i className="fas fa-store text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Configurar tienda
            </h3>
            <p className="text-sm text-gray-600">
              Personaliza tu catálogo virtual con tus productos
            </p>
          </div>

          {/* Action Card 2 */}
          <div className="card-surface p-6 card-hover cursor-pointer group">
            <div className="icon-squircle mb-4 group-hover:scale-110 transition-transform">
              <i className="fas fa-link text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Tu enlace
            </h3>
            <p className="text-sm text-gray-600">
              Comparte tu enlace con tus clientes
            </p>
          </div>

          {/* Action Card 3 */}
          <div className="card-surface p-6 card-hover cursor-pointer group">
            <div className="icon-squircle mb-4 group-hover:scale-110 transition-transform">
              <i className="fas fa-chart-line text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Estadísticas
            </h3>
            <p className="text-sm text-gray-600">
              Revisa el rendimiento de tu catálogo
            </p>
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="mt-12 card-surface p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <i className="fas fa-lightbulb text-[#2ECC71] mr-2"></i>
            Primeros pasos
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#2ECC71] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Agrega tus productos</p>
                <p className="text-sm text-gray-600">Sube fotos, descripciones y precios de tus productos</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#2ECC71] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Personaliza tu catálogo</p>
                <p className="text-sm text-gray-600">Organiza por categorías y ajusta el diseño</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#2ECC71] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Comparte tu enlace</p>
                <p className="text-sm text-gray-600">Envía tu enlace por WhatsApp y redes sociales</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
