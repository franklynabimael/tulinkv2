"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

export default function CatalogoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { profile } = useAuth();

  const navItems = [
    {
      href: "/dashboard/catalogo/categorias",
      label: "Categorías",
      icon: "fa-folder",
    },
    {
      href: "/dashboard/catalogo/productos",
      label: "Productos",
      icon: "fa-box",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2ECC71] to-[#27ae60] rounded-xl flex items-center justify-center shadow-lg shadow-[#2ECC71]/30 transition-transform duration-300 group-hover:scale-105">
                <i className="fas fa-link text-white"></i>
              </div>
              <span className="text-xl font-bold text-gray-900">TuLink</span>
            </Link>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2ECC71]/20 to-[#2ECC71]/10 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-[#2ECC71]"></i>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {profile?.name || "Usuario"}
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="btn-secondary px-4 py-2 text-sm"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Volver al dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Catalog Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-[24px] shadow-lg p-2 inline-flex gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-6 py-3 rounded-[12px] font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? "bg-gradient-to-br from-[#2ECC71] to-[#27ae60] text-white shadow-lg shadow-[#2ECC71]/30"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <i className={`fas ${item.icon}`}></i>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}
