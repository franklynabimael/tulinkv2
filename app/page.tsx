"use client";

import { useState, useEffect, useRef } from "react";

// Types
interface FormErrors {
  businessName?: string;
  email?: string;
  phone?: string;
}

interface Testimonial {
  name: string;
  business: string;
  image: string;
  quote: string;
  rating: number;
}

interface FAQ {
  question: string;
  answer: string;
}

// Detect currency based on locale (computed outside component to avoid re-calculation)
function detectInitialCurrency(): { symbol: string; code: string } {
  try {
    const userLocale = navigator.language || "es-DO";
    if (userLocale.includes("US")) return { symbol: "$", code: "USD" };
    if (userLocale.includes("MX")) return { symbol: "MX$", code: "MXN" };
    if (userLocale.includes("CO")) return { symbol: "COL$", code: "COP" };
    if (userLocale.includes("AR")) return { symbol: "AR$", code: "ARS" };
    if (userLocale.includes("CL")) return { symbol: "CL$", code: "CLP" };
    // Default: RD$ for Dominican Republic
    return { symbol: "RD$", code: "DOP" };
  } catch {
    return { symbol: "RD$", code: "DOP" };
  }
}

export default function Home() {
  const [subdomain, setSubdomain] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [currency] = useState<{ symbol: string; code: string }>(detectInitialCurrency);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap for mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      const firstFocusable = mobileMenuRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setMobileMenuOpen(false);
          return;
        }

        if (e.key === "Tab") {
          const focusableElements = mobileMenuRef.current?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (!focusableElements || focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Live sync para el mockup
  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
    setSubdomain(value);
    setFormData({ ...formData, businessName: value });

    // Clear error when user types
    if (touchedFields.businessName && formErrors.businessName) {
      setFormErrors({ ...formErrors, businessName: undefined });
    }
  };

  // Validate individual field
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "businessName":
        if (!value.trim()) return "El nombre del negocio es requerido";
        if (value.length < 3) return "Mínimo 3 caracteres";
        if (value.length > 50) return "Máximo 50 caracteres";
        return undefined;
      case "email":
        if (!value.trim()) return "El correo electrónico es requerido";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Ingresa un correo válido";
        return undefined;
      case "phone":
        if (!value.trim()) return "El WhatsApp es requerido";
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ""))) return "Ingresa un WhatsApp válido";
        if (value.replace(/\D/g, "").length < 7) return "El número es muy corto";
        return undefined;
      default:
        return undefined;
    }
  };

  // Handle field blur
  const handleFieldBlur = (fieldName: string) => {
    setTouchedFields({ ...touchedFields, [fieldName]: true });
    const error = validateField(fieldName, formData[fieldName as keyof typeof formData]);
    setFormErrors({ ...formErrors, [fieldName]: error });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation if field was touched
    if (touchedFields[name]) {
      const error = validateField(name, value);
      setFormErrors({ ...formErrors, [name]: error });
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {};
    (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      setTouchedFields({
        businessName: true,
        email: true,
        phone: true,
      });

      // Focus first error field
      const firstErrorField = Object.keys(newErrors)[0];
      document.getElementById(firstErrorField)?.focus();
      return;
    }

    setIsSubmitting(true);

    // Simulación de envío
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Scroll automático hacia el mensaje de éxito
    setTimeout(() => {
      document.getElementById("success-message")?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 100);
  };

  // Handle edit form after submission
  const handleEditForm = () => {
    setIsSubmitted(false);
    setTimeout(() => {
      document.getElementById("businessName")?.focus();
    }, 100);
  };

  // Testimonials data
  const testimonials: Testimonial[] = [
    {
      name: "María González",
      business: "Boutique María",
      image: "https://i.pravatar.cc/150?img=5",
      quote: "Antes perdía horas respondiendo mensajes. Ahora mis clientes ven todo en mi catálogo y solo recibo pedidos listos para cerrar.",
      rating: 5,
    },
    {
      name: "Carlos Rodríguez",
      business: "TechStore RD",
      image: "https://i.pravatar.cc/150?img=11",
      quote: "Mis ventas aumentaron 40% desde que uso TuLink. Es increíblemente fácil de usar y mis clientes lo aman.",
      rating: 5,
    },
    {
      name: "Ana Martínez",
      business: "Dulces Antojitos",
      image: "https://i.pravatar.cc/150?img=9",
      quote: "Lo mejor es que no pago comisiones por venta. El plan es súper accesible y el soporte siempre me ayuda rápido.",
      rating: 5,
    },
  ];

  // FAQ data
  const faqs: FAQ[] = [
    {
      question: "¿Necesito conocimientos técnicos para usar TuLink?",
      answer: "¡Para nada! TuLink está diseñado para que cualquier persona pueda usarlo. Si sabes usar WhatsApp, sabes usar TuLink. La plataforma es intuitiva y te guiamos en cada paso.",
    },
    {
      question: "¿Puedo subir todos mis productos sin límite?",
      answer: "Sí, exactamente. No tenemos límite de productos, categorías o variantes. Puedes subir todo tu inventario sin preocuparte por restricciones.",
    },
    {
      question: "¿Mis clientes necesitan descargar una app?",
      answer: "No, tus clientes no necesitan descargar nada. Solo comparten tu enlace y ellos pueden ver tu catálogo desde cualquier navegador, sin instalaciones.",
    },
    {
      question: "¿Qué pasa después del mes gratis?",
      answer: "Después de tu primer mes gratis, tu suscripción se renueva automáticamente a RD$500/mes. Puedes cancelar cuando quieras, sin preguntas ni compromisos.",
    },
    {
      question: "¿Puedo cancelar mi suscripción?",
      answer: "Sí, puedes cancelar en cualquier momento desde tu panel de control. No hay contratos a largo plazo ni penalidades por cancelar.",
    },
    {
      question: "¿El enlace es personalizado?",
      answer: "Sí, tu enlace será tunegocio.tulink.do. Puedes personalizarlo con el nombre de tu negocio para que sea fácil de recordar y compartir.",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB]">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-[#2ECC71] focus:font-bold focus:px-6 focus:py-3 focus:rounded-xl focus:shadow-lg"
      >
        Saltar al contenido principal
      </a>

      {/* ==================== NAVIGATION (Sticky) ==================== */}
      <nav className="sticky top-0 z-50 glass" role="navigation" aria-label="Navegación principal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group" aria-label="TuLink - Inicio">
              <div className="logo-container transition-transform duration-300 group-hover:scale-105">
                <i className="fas fa-link text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold text-gray-900">TuLink</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <a
                href="#beneficios"
                className="nav-link focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] focus-visible:ring-offset-2 rounded"
              >
                Beneficios
              </a>
              <a
                href="#como-funciona"
                className="nav-link focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] focus-visible:ring-offset-2 rounded"
              >
                Cómo Funciona
              </a>
              <a
                href="#testimonios"
                className="nav-link focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] focus-visible:ring-offset-2 rounded"
              >
                Testimonios
              </a>
              <a
                href="#precios"
                className="nav-link focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] focus-visible:ring-offset-2 rounded"
              >
                Precios
              </a>
              <a
                href="#faq"
                className="nav-link focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] focus-visible:ring-offset-2 rounded"
              >
                FAQ
              </a>
            </div>

            {/* Mobile Navigation Links */}
            <div className="hidden md:flex lg:hidden items-center gap-6">
              <a
                href="#precios"
                className="nav-link focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] focus-visible:ring-offset-2 rounded"
              >
                Precios
              </a>
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <a
                href="/registro"
                className="btn-primary inline-flex items-center gap-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2ECC71]/50"
              >
                Empezar Gratis
                <i className="fas fa-arrow-right"></i>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-[#2ECC71] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] rounded-lg"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="drawer-overlay"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          ></div>
          <div
            id="mobile-menu"
            ref={mobileMenuRef}
            className={`drawer-content ${mobileMenuOpen ? "drawer-open" : "drawer-closed"}`}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#2ECC71] rounded-lg flex items-center justify-center">
                  <i className="fas fa-link text-white text-sm"></i>
                </div>
                <span className="font-bold text-gray-900">TuLink</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-[#2ECC71] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] rounded-lg"
                aria-label="Cerrar menú"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <a
                href="#beneficios"
                className="block py-3 text-gray-600 hover:text-[#2ECC71] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Beneficios
              </a>
              <a
                href="#como-funciona"
                className="block py-3 text-gray-600 hover:text-[#2ECC71] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cómo Funciona
              </a>
              <a
                href="#testimonios"
                className="block py-3 text-gray-600 hover:text-[#2ECC71] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonios
              </a>
              <a
                href="#precios"
                className="block py-3 text-gray-600 hover:text-[#2ECC71] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Precios
              </a>
              <a
                href="#faq"
                className="block py-3 text-gray-600 hover:text-[#2ECC71] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <a
                href="/registro"
                className="btn-primary block text-center focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2ECC71]/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Empezar Gratis
              </a>
            </div>
          </div>
        </>
      )}

      {/* ==================== HERO SECTION ==================== */}
      <main id="main-content">
        <section className="pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 gradient-hero relative overflow-hidden">
          {/* Decorative gradient orbs */}
          <div className="gradient-orb w-[500px] h-[500px] -top-40 -left-40 opacity-60 hidden sm:block"></div>
          <div className="gradient-orb w-[400px] h-[400px] top-1/4 right-0 opacity-40 hidden md:block"></div>
          <div className="gradient-orb w-[300px] h-[300px] bottom-0 left-1/3 opacity-30 hidden lg:block"></div>

          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">

              {/* Hero Content */}
              <div className="text-center lg:text-left relative z-10">
                <div className="inline-flex items-center gap-2 badge-new mb-6 sm:mb-8">
                  <i className="fas fa-sparkles animate-pulse"></i>
                  <span>Prueba gratis por 1 mes</span>
                </div>

                <h1 className="hero-headline mb-4 sm:mb-6">
                  Tu catálogo virtual,{" "}
                  <span className="text-[#2ECC71]">pedidos por WhatsApp</span>
                </h1>

                <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed px-2 sm:px-0">
                  La plataforma SaaS que te permite crear tu tienda online en minutos,
                  mostrar tus productos y recibir pedidos directamente en tu WhatsApp.
                  <span className="font-semibold text-gray-700"> Sin comisiones por venta.</span>
                </p>

                {/* Subdomain Builder */}
                <div className="subdomain-builder mb-6 sm:mb-8">
                  <input
                    type="text"
                    placeholder="tu-negocio"
                    value={subdomain}
                    onChange={handleSubdomainChange}
                    className="subdomain-input text-base sm:text-lg"
                    maxLength={30}
                    aria-label="Nombre de tu negocio para tu enlace personalizado"
                  />
                  <div className="subdomain-suffix">
                    <i className="fas fa-link mr-2 opacity-70 hidden sm:inline"></i>
                    .tulink.do
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-10 flex items-center justify-center lg:justify-start gap-2 px-2 sm:px-0">
                  <i className="fas fa-shield-check text-[#2ECC71]"></i>
                  Tu enlace personalizado te espera · Sin tarjeta de crédito
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                  <a
                    href="/registro"
                    className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2ECC71]/50"
                  >
                    <i className="fas fa-rocket"></i>
                    Comenzar prueba gratis
                  </a>
                  <a
                    href="#beneficios"
                    className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-400/50"
                  >
                    <i className="fas fa-play-circle"></i>
                    Ver características
                  </a>
                </div>

                {/* Trust indicators */}
                <div className="mt-8 sm:mt-12 flex items-center justify-center lg:justify-start gap-4 sm:gap-8 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <i className="fas fa-users text-[#2ECC71] text-sm sm:text-base"></i>
                    <span>+500 emprendedores</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <i className="fas fa-star text-[#2ECC71] text-sm sm:text-base"></i>
                    <span>4.9/5 calificación</span>
                  </div>
                </div>
              </div>

              {/* Phone Mockup - Fixed overflow issues */}
              <div className="flex justify-center lg:justify-end relative">
                {/* Decorative elements behind phone */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-gradient-to-br from-[#2ECC71]/20 to-transparent rounded-full blur-3xl -z-10"></div>

                <div className="phone-mockup max-w-full">
                  <div className="phone-screen bg-gray-50">
                    {/* Mockup Header */}
                    <div className="bg-gradient-to-r from-[#2ECC71] to-[#27ae60] text-white p-4 pt-10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/25 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <i className="fas fa-store text-white text-sm sm:text-base"></i>
                        </div>
                        <div>
                          <p className="font-bold text-xs sm:text-sm truncate max-w-[180px] sm:max-w-none">
                            {subdomain.trim() ? subdomain.charAt(0).toUpperCase() + subdomain.slice(1) : "Tu Negocio"}
                          </p>
                          <p className="text-xs text-white/85">Catálogo Online</p>
                        </div>
                      </div>
                    </div>

                    {/* Mockup Products Grid */}
                    <div className="p-3 sm:p-4">
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        {[1, 2, 3, 4].map((item) => (
                          <div
                            key={item}
                            className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-md hover:shadow-lg transition-shadow duration-300"
                          >
                            <div className="w-full h-16 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg sm:rounded-xl mb-2"></div>
                            <div className="h-2 sm:h-3 bg-gray-200 rounded mb-1 w-3/4"></div>
                            <div className="h-2 sm:h-3 bg-gradient-to-r from-[#2ECC71]/30 to-[#2ECC71]/50 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>

                      {/* Mockup CTA */}
                      <div className="mt-3 sm:mt-4 bg-gradient-to-r from-[#2ECC71] to-[#27ae60] text-white text-center py-2.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-base shadow-lg shadow-[#2ECC71]/30 flex items-center justify-center gap-1.5 sm:gap-2">
                        <i className="fab fa-whatsapp text-base sm:text-xl"></i>
                        <span className="hidden sm:inline">Pedir por WhatsApp</span>
                        <span className="sm:hidden">Pedir</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== BENEFICIOS (Pain Cards) ==================== */}
        <section id="beneficios" className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white relative overflow-x-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-20">
              <div className="inline-flex items-center gap-2 badge-new mb-6">
                <i className="fas fa-heart"></i>
                <span>Beneficios</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 sm:mb-6 px-4">
                Resolvemos tus problemas de venta
              </h2>
              <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                Diseñado por vendedores, para vendedores
              </p>
            </div>

            <div className="benefits-grid">
              {/* Beneficio 1 - Desorden de Inventario */}
              <div className="card-surface p-6 sm:p-10 card-hover group">
                <div className="icon-squircle mb-6 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-images text-xl sm:text-2xl"></i>
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Adiós al desorden de inventario
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  Evita subir fotos repetitivas a estados de WhatsApp o feeds de Instagram.
                  Todo tu catálogo organizado en un solo lugar.
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="feature-check">
                    <i className="fas fa-check-circle text-sm sm:text-base"></i>
                    <span className="text-xs sm:text-sm text-gray-600">Productos siempre actualizados</span>
                  </li>
                  <li className="feature-check">
                    <i className="fas fa-check-circle text-sm sm:text-base"></i>
                    <span className="text-xs sm:text-sm text-gray-600">Sin fotos duplicadas</span>
                  </li>
                </ul>
              </div>

              {/* Beneficio 2 - Saturación de DMs */}
              <div className="card-surface p-6 sm:p-10 card-hover group">
                <div className="icon-squircle mb-6 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-comments text-xl sm:text-2xl"></i>
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Elimina la saturación de DMs
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  Reduce el flujo constante de preguntas sobre precios y disponibilidad.
                  Tus clientes encuentran todo en tu catálogo.
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="feature-check">
                    <i className="fas fa-check-circle text-sm sm:text-base"></i>
                    <span className="text-xs sm:text-sm text-gray-600">Menos mensajes repetitivos</span>
                  </li>
                  <li className="feature-check">
                    <i className="fas fa-check-circle text-sm sm:text-base"></i>
                    <span className="text-xs sm:text-sm text-gray-600">Información siempre disponible</span>
                  </li>
                </ul>
              </div>

              {/* Beneficio 3 - Fricción de Compra */}
              <div className="card-surface p-6 sm:p-10 card-hover group">
                <div className="icon-squircle mb-6 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-shopping-cart text-xl sm:text-2xl"></i>
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Automatiza la toma de pedidos
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  El carrito se envía directamente a tu WhatsApp con todos los detalles
                  del pedido. Cierra ventas más rápido.
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="feature-check">
                    <i className="fas fa-check-circle text-sm sm:text-base"></i>
                    <span className="text-xs sm:text-sm text-gray-600">Pedidos estructurados</span>
                  </li>
                  <li className="feature-check">
                    <i className="fas fa-check-circle text-sm sm:text-base"></i>
                    <span className="text-xs sm:text-sm text-gray-600">Integración con WhatsApp</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== CÓMO FUNCIONA (3 Pasos) ==================== */}
        <section id="como-funciona" className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F9FAFB] via-white to-[#F9FAFB] relative overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-20">
              <div className="inline-flex items-center gap-2 badge-new mb-6">
                <i className="fas fa-lightbulb"></i>
                <span>Cómo Funciona</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 sm:mb-6 px-4">
                Empieza a vender en 3 pasos
              </h2>
              <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                Tan simple que cualquier persona puede usarlo
              </p>
            </div>

            <div className="flow-steps">
              {/* Paso 1 - Sube */}
              <div className="text-center group relative">
                <div className="step-badge mb-8 group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 px-4">
                  Sube tu catálogo
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto px-4">
                  Gestiona tu catálogo masivo de productos. Añade fotos, descripciones
                  y precios en minutos.
                </p>
              </div>

              {/* Paso 2 - Comparte */}
              <div className="text-center group relative">
                <div className="step-badge mb-8 group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 px-4">
                  Comparte tu enlace
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto px-4">
                  Distribuye tu enlace personalizado en tu bio de Instagram, TikTok,
                  Facebook y estados de WhatsApp.
                </p>
              </div>

              {/* Paso 3 - Vende */}
              <div className="text-center group relative">
                <div className="step-badge mb-8 group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 px-4">
                  Recibe pedidos
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto px-4">
                  Los clientes seleccionan productos y el pedido llega estructurado
                  directamente a tu WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== TESTIMONIOS (NEW SECTION) ==================== */}
        <section id="testimonios" className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white relative overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-20">
              <div className="inline-flex items-center gap-2 badge-new mb-6">
                <i className="fas fa-star"></i>
                <span>Testimonios</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 sm:mb-6 px-4">
                Vendedores como tú ya están creciendo
              </h2>
              <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                Únete a más de 500 emprendedores que ya usan TuLink
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="card-surface p-6 sm:p-8 card-hover group bg-gradient-to-br from-white to-[#2ECC71]/5"
                >
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star text-[#FFD700] text-sm"></i>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm sm:text-base text-gray-700 mb-6 leading-relaxed italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#2ECC71]/20"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">{testimonial.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{testimonial.business}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social proof stats */}
            <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              <div className="text-center p-4">
                <p className="text-3xl sm:text-4xl font-black text-[#2ECC71] mb-1">+500</p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Emprendedores</p>
              </div>
              <div className="text-center p-4">
                <p className="text-3xl sm:text-4xl font-black text-[#2ECC71] mb-1">4.9/5</p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Calificación</p>
              </div>
              <div className="text-center p-4">
                <p className="text-3xl sm:text-4xl font-black text-[#2ECC71] mb-1">+10K</p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Pedidos/mes</p>
              </div>
              <div className="text-center p-4">
                <p className="text-3xl sm:text-4xl font-black text-[#2ECC71] mb-1">98%</p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Satisfacción</p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== PRECIOS ==================== */}
        <section id="precios" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F9FAFB] via-white to-[#2ECC71]/5 relative overflow-hidden overflow-x-hidden">
          {/* Background decoration */}
          <div className="gradient-orb w-[600px] h-[600px] -bottom-40 -right-40 opacity-40"></div>
          <div className="gradient-orb w-[400px] h-[400px] top-1/4 -left-20 opacity-30"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 badge-new mb-6">
                <i className="fas fa-tag"></i>
                <span>Precios</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 px-4">
                Elige el plan perfecto para ti
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 mb-8">
                Sin complicaciones. Sin costos ocultos. Todo lo que necesitas para vender.
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4">
                <span className={`text-sm font-bold ${billingPeriod === "monthly" ? "text-gray-900" : "text-gray-500"}`}>
                  Mensual
                </span>
                <button
                  onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "annual" : "monthly")}
                  className="relative w-16 h-8 bg-gray-300 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2ECC71]/50"
                  aria-label="Cambiar período de facturación"
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${billingPeriod === "annual" ? "translate-x-8" : "translate-x-0"
                      }`}
                  ></div>
                </button>
                <span className={`text-sm font-bold ${billingPeriod === "annual" ? "text-gray-900" : "text-gray-500"}`}>
                  Anual
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-gray-900">
                  <i className="fas fa-gift"></i>
                  Ahorra 20%
                </span>
              </div>
            </div>

            {/* Pricing Grid - 3 Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {/* Plan Gratis */}
              <div className="card-surface rounded-[32px] p-6 sm:p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-gray-100">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                      <i className="fas fa-rocket"></i>
                      PARA EMPEZAR
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">
                    Plan Gratis
                  </h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-5xl font-black text-gray-900">{currency.symbol}0</span>
                    <span className="text-gray-600 text-sm font-medium">/mes</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Perfecto para comenzar
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-[#2ECC71]/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-[#2ECC71] text-[10px]"></i>
                    </div>
                    <span className="text-sm">Hasta 20 productos</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-[#2ECC71]/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-[#2ECC71] text-[10px]"></i>
                    </div>
                    <span className="text-sm">Catálogo básico</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-[#2ECC71]/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-[#2ECC71] text-[10px]"></i>
                    </div>
                    <span className="text-sm">Pedidos por WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-[#2ECC71]/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-[#2ECC71] text-[10px]"></i>
                    </div>
                    <span className="text-sm">Enlace personalizado</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-times text-gray-400 text-[10px]"></i>
                    </div>
                    <span className="text-sm">Estadísticas</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-times text-gray-400 text-[10px]"></i>
                    </div>
                    <span className="text-sm">Soporte prioritario</span>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href="/registro"
                  className="btn-secondary w-full block text-center font-bold text-sm py-3 focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-400/50"
                >
                  <i className="fas fa-rocket mr-2"></i>
                  Comenzar gratis
                </a>
              </div>

              {/* Plan Pro - RD$500/mes - Popular */}
              <div className="pricing-card-popular rounded-[32px] p-6 sm:p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-gray-100">
                {/* Popular Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">

                </div>

                <div className="pricing-content">
                  <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                      <span className="savings-badge text-xs sm:text-sm px-4 py-2">
                        <i className="fas fa-star text-sm"></i>
                        MÁS POPULAR
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white mb-3">
                      Plan Pro
                    </h3>
                    <div className="flex items-baseline justify-center gap-2 mb-1">
                      {billingPeriod === "annual" ? (
                        <>
                          <span className="text-xl text-white/70 line-through font-bold">{currency.symbol}500</span>
                          <div className="flex items-baseline gap-1">
                            <span className="price-number text-5xl font-black">{currency.symbol}400</span>
                            <span className="text-white/80 text-sm font-medium">/mes</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="price-number text-5xl font-black">{currency.symbol}500</span>
                          <span className="text-white/80 text-sm font-medium">/mes</span>
                        </>
                      )}
                    </div>
                    <p className="text-white/90 text-xs">
                      {billingPeriod === "annual" ? (
                        <>
                          <span className="font-bold">{currency.symbol}4,800/año</span> · Ahorras {currency.symbol}1,200
                        </>
                      ) : (
                        <>Facturado mensualmente</>
                      )}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8 flex-grow">
                    <div className="pricing-check">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-check text-white text-[12px]"></i>
                      </div>
                      <span className="text-sm font-medium">Productos ilimitados</span>
                    </div>
                    <div className="pricing-check">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-check text-white text-[12px]"></i>
                      </div>
                      <span className="text-sm font-medium">Catálogo sin restricciones</span>
                    </div>
                    <div className="pricing-check">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-check text-white text-[12px]"></i>
                      </div>
                      <span className="text-sm font-medium">Pedidos por WhatsApp</span>
                    </div>
                    <div className="pricing-check">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-check text-white text-[12px]"></i>
                      </div>
                      <span className="text-sm font-medium">Enlace personalizado</span>
                    </div>
                    <div className="pricing-check">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-check text-white text-[12px]"></i>
                      </div>
                      <span className="text-sm font-medium">Estadísticas en tiempo real</span>
                    </div>
                    <div className="pricing-check">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-check text-white text-[12px]"></i>
                      </div>
                      <span className="text-sm font-medium">Soporte prioritario 24/7</span>
                    </div>
                    <div className="pricing-check">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-check text-white text-[12px]"></i>
                      </div>
                      <span className="text-sm font-medium">0% comisiones</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <a
                    href="/registro"
                    className="btn-secondary w-full block text-center font-bold text-sm py-3 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                  >
                    <i className="fas fa-rocket mr-2"></i>
                    Comenzar prueba gratis
                  </a>

                  <p className="text-xs text-white/70 text-center mt-3">
                    1 mes gratis · Luego {billingPeriod === "annual" ? `${currency.symbol}400/mes` : `${currency.symbol}500/mes`}
                  </p>
                </div>
              </div>

              {/* Plan Business - RD$1000/mes */}
              <div className="card-surface rounded-[32px] p-6 sm:p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-[#2ECC71]/30 bg-gradient-to-br from-white to-[#2ECC71]/5">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-[#2ECC71]/20 to-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/30">
                      <i className="fas fa-crown"></i>
                      PARA ESCALAR
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">
                    Plan Business
                  </h3>
                  <div className="flex items-baseline justify-center gap-2 mb-1">
                    {billingPeriod === "annual" ? (
                      <>
                        <span className="text-xl text-gray-400 line-through font-bold">{currency.symbol}1000</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-black text-[#2ECC71]">{currency.symbol}800</span>
                          <span className="text-gray-600 text-sm font-medium">/mes</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-5xl font-black text-[#2ECC71]">{currency.symbol}1000</span>
                        <span className="text-gray-600 text-sm font-medium">/mes</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {billingPeriod === "annual" ? (
                      <>
                        <span className="font-bold">{currency.symbol}9,600/año</span> · Ahorras {currency.symbol}2,400
                      </>
                    ) : (
                      <>Facturado mensualmente</>
                    )}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-[#2ECC71]/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-[#2ECC71] text-[10px]"></i>
                    </div>
                    <span className="text-sm">Todo del Plan Pro</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-[#2ECC71]/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-[#2ECC71] text-[10px]"></i>
                    </div>
                    <span className="text-sm">Múltiples catálogos</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-[#2ECC71]/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-[#2ECC71] text-[10px]"></i>
                    </div>
                    <span className="text-sm">Dominio personalizado</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-[#2ECC71]/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-[#2ECC71] text-[10px]"></i>
                    </div>
                    <span className="text-sm">Análisis avanzado</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-[#2ECC71]/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-[#2ECC71] text-[10px]"></i>
                    </div>
                    <span className="text-sm">Integraciones API</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-[#2ECC71]/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-[#2ECC71] text-[10px]"></i>
                    </div>
                    <span className="text-sm">Soporte VIP dedicado</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-[#2ECC71]/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-[#2ECC71] text-[10px]"></i>
                    </div>
                    <span className="text-sm">Prioridad en nuevas funciones</span>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href="/registro"
                  className="btn-primary w-full block text-center font-bold text-sm py-3 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2ECC71]/50"
                >
                  <i className="fas fa-crown mr-2"></i>
                  Comenzar prueba gratis
                </a>

                <p className="text-xs text-gray-500 text-center mt-3">
                  1 mes gratis · Luego {billingPeriod === "annual" ? `${currency.symbol}800/mes` : `${currency.symbol}1000/mes`}
                </p>
              </div>
            </div>

            {/* Value proposition */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-4 max-w-3xl mx-auto px-4">
              <div className="value-prop-item">
                <span>Todo Ilimitado</span>
              </div>
              <div className="value-prop-item">
                <span>Sin Comisiones</span>
              </div>
              <div className="value-prop-item">
                <span>Soporte 24/7</span>
              </div>
            </div>

            {/* Guarantee */}
            <div className="mt-12 text-center px-4">
              <div className="guarantee-badge inline-flex flex-col sm:flex-row text-center sm:text-left">
                <i className="fas fa-shield-heart text-[#2ECC71] text-2xl sm:text-3xl"></i>
                <div className="text-left sm:text-left mt-3 sm:mt-0 sm:ml-4">
                  <p className="font-bold text-gray-900 text-base sm:text-lg">Garantía de satisfacción</p>
                  <p className="text-xs sm:text-sm text-gray-600">Cancela cuando quieras · Sin preguntas</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== FAQ SECTION ==================== */}
        <section id="faq" className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#F9FAFB]">
          <div className="max-w-3xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 badge-new mb-6">
                <i className="fas fa-question"></i>
                <span>FAQ</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 sm:mb-6 px-4">
                Preguntas frecuentes
              </h2>
              <p className="text-base sm:text-xl text-gray-600 leading-relaxed px-4">
                Resolvemos tus dudas antes de empezar
              </p>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFAQ === index;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-[24px] border border-gray-100 shadow-lg overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        console.log("FAQ clicked, index:", index, "current open:", openFAQ);
                        if (openFAQ === index) {
                          setOpenFAQ(null);
                        } else {
                          setOpenFAQ(index);
                        }
                      }}
                      className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-bold text-gray-900 text-sm sm:text-base pr-4">
                        {faq.question}
                      </span>
                      <svg
                        className={`w-5 h-5 flex-shrink-0 text-[#2ECC71] transition-transform duration-300 ml-4 ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5">
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Contact CTA */}
            <div className="mt-10 text-center px-4">
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                ¿Tienes más preguntas?
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-[#2ECC71] font-bold hover:underline"
              >
                <i className="fas fa-envelope"></i>
                Contáctanos
              </a>
            </div>
          </div>
        </section>

        {/* ==================== FORMULARIO DE CAPTACIÓN ==================== */}
        <section id="registro" className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#F9FAFB] relative">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="gradient-orb w-[400px] h-[400px] -bottom-40 -right-40 opacity-30 hidden sm:block"></div>
            <div className="gradient-orb w-[300px] h-[300px] top-1/3 -left-20 opacity-20 hidden sm:block"></div>
          </div>

          <div className="max-w-2xl mx-auto relative z-10">
            <div className="text-center mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-2 badge-new mb-6">
                <i className="fas fa-rocket"></i>
                <span>Comienza Ahora</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 sm:mb-6">
                Comienza tu prueba gratis
              </h2>
              <p className="text-base sm:text-xl text-gray-600 leading-relaxed px-4">
                1 mes gratis · Sin tarjeta de crédito · Cancela cuando quieras
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="card-surface p-6 sm:p-10 lg:p-12" noValidate>
                <div className="space-y-5 sm:space-y-6">
                  {/* Business Name */}
                  <div>
                    <label htmlFor="businessName" className="form-label">
                      Nombre de tu negocio *
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur("businessName")}
                      placeholder="Ej: Boutique María"
                      className={`input-interactive text-sm sm:text-base ${formErrors.businessName && touchedFields.businessName
                          ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/15"
                          : ""
                        }`}
                      required
                      aria-invalid={!!(formErrors.businessName && touchedFields.businessName)}
                      aria-describedby={formErrors.businessName && touchedFields.businessName ? "businessName-error" : undefined}
                    />
                    {formErrors.businessName && touchedFields.businessName && (
                      <p id="businessName-error" className="mt-2 text-sm text-[#EF4444] flex items-center gap-1.5">
                        <i className="fas fa-circle-exclamation"></i>
                        {formErrors.businessName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="form-label">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur("email")}
                      placeholder="tu@correo.com"
                      className={`input-interactive text-sm sm:text-base ${formErrors.email && touchedFields.email
                          ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/15"
                          : ""
                        }`}
                      required
                      aria-invalid={!!(formErrors.email && touchedFields.email)}
                      aria-describedby={formErrors.email && touchedFields.email ? "email-error" : undefined}
                    />
                    {formErrors.email && touchedFields.email && (
                      <p id="email-error" className="mt-2 text-sm text-[#EF4444] flex items-center gap-1.5">
                        <i className="fas fa-circle-exclamation"></i>
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="form-label">
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur("phone")}
                      placeholder="+1 (809) 000-0000"
                      className={`input-interactive text-sm sm:text-base ${formErrors.phone && touchedFields.phone
                          ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/15"
                          : ""
                        }`}
                      required
                      aria-invalid={!!(formErrors.phone && touchedFields.phone)}
                      aria-describedby={formErrors.phone && touchedFields.phone ? "phone-error" : undefined}
                    />
                    {formErrors.phone && touchedFields.phone && (
                      <p id="phone-error" className="mt-2 text-sm text-[#EF4444] flex items-center gap-1.5">
                        <i className="fas fa-circle-exclamation"></i>
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm sm:text-base focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2ECC71]/50"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-circle-notch fa-spin"></i>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-rocket"></i>
                        Crear mi cuenta gratis
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center leading-relaxed px-4">
                    Al registrarte, aceptas nuestros{" "}
                    <a href="#" className="text-[#2ECC71] hover:underline font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] rounded">
                      Términos
                    </a>
                    {" "}y{" "}
                    <a href="#" className="text-[#2ECC71] hover:underline font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] rounded">
                      Política de Privacidad
                    </a>
                  </p>
                </div>
              </form>
            ) : (
              <div id="success-message" className="card-surface p-6 sm:p-10 lg:p-12 text-center">
                <div className="success-check">
                  <i className="fas fa-check"></i>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 sm:mb-5">
                  ¡Bienvenido a TuLink!
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed px-4">
                  Hemos recibido tu registro. Pronto recibirás un correo con los
                  siguientes pasos para configurar tu catálogo.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href="#"
                    className="btn-primary inline-flex items-center gap-3 text-sm sm:text-base focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2ECC71]/50"
                  >
                    <i className="fas fa-inbox"></i>
                    Revisar mi correo
                  </a>
                  <button
                    onClick={handleEditForm}
                    className="btn-secondary inline-flex items-center gap-3 text-sm sm:text-base focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-400/50"
                  >
                    <i className="fas fa-pen"></i>
                    Editar información
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group" aria-label="TuLink - Inicio">
              <div className="logo-container transition-transform duration-300 group-hover:scale-105">
                <i className="fas fa-link text-white text-lg"></i>
              </div>
              <span className="text-xl sm:text-2xl font-black">TuLink</span>
            </a>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8">
              <a
                href="#"
                className="text-sm sm:text-base text-gray-400 hover:text-[#2ECC71] transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] rounded px-2 py-1"
              >
                Términos
              </a>
              <a
                href="#"
                className="text-sm sm:text-base text-gray-400 hover:text-[#2ECC71] transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] rounded px-2 py-1"
              >
                Privacidad
              </a>
              <a
                href="#"
                className="text-sm sm:text-base text-gray-400 hover:text-[#2ECC71] transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] rounded px-2 py-1"
              >
                Contacto
              </a>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href="#"
                className="social-btn w-10 h-10 sm:w-12 sm:h-12 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] rounded-full"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram text-white text-sm sm:text-base"></i>
              </a>
              <a
                href="#"
                className="social-btn w-10 h-10 sm:w-12 sm:h-12 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] rounded-full"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f text-white text-sm sm:text-base"></i>
              </a>
              <a
                href="#"
                className="social-btn w-10 h-10 sm:w-12 sm:h-12 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECC71] rounded-full"
                aria-label="TikTok"
              >
                <i className="fab fa-tiktok text-white text-sm sm:text-base"></i>
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-8 text-center">
            <p className="text-gray-500 text-xs sm:text-sm">
              © 2026 TuLink. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
