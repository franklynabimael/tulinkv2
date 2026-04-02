"use client";

import { useState } from "react";

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

  // Live sync para el mockup
  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    setSubdomain(value);
    setFormData({ ...formData, businessName: value });
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB]">

      {/* ==================== NAVIGATION (Sticky) ==================== */}
      <nav className="sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="logo-container">
                <i className="fas fa-link text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold text-gray-900">TuLink</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#beneficios" className="nav-link">
                Beneficios
              </a>
              <a href="#como-funciona" className="nav-link">
                Cómo Funciona
              </a>
              <a href="#precios" className="nav-link">
                Precios
              </a>
            </div>

            {/* Mobile Navigation Links */}
            <div className="hidden md:flex lg:hidden items-center gap-6">
              <a href="#precios" className="nav-link">
                Precios
              </a>
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <a href="#registro" className="btn-primary inline-flex items-center gap-2">
                Empezar Gratis
                <i className="fas fa-arrow-right"></i>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-[#2ECC71] transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menú"
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
          ></div>
          <div className={`drawer-content ${mobileMenuOpen ? 'drawer-open' : 'drawer-closed'}`}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#2ECC71] rounded-lg flex items-center justify-center">
                  <i className="fas fa-link text-white text-sm"></i>
                </div>
                <span className="font-bold text-gray-900">TuLink</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-[#2ECC71] transition-colors"
                aria-label="Cerrar menú"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <a
                href="#beneficios"
                className="block py-3 text-gray-600 hover:text-[#2ECC71] font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Beneficios
              </a>
              <a
                href="#como-funciona"
                className="block py-3 text-gray-600 hover:text-[#2ECC71] font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cómo Funciona
              </a>
              <a
                href="#precios"
                className="block py-3 text-gray-600 hover:text-[#2ECC71] font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Precios
              </a>
              <a
                href="#registro"
                className="btn-primary block text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Empezar Gratis
              </a>
            </div>
          </div>
        </>
      )}

      {/* ==================== HERO SECTION ==================== */}
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
                  maxLength={20}
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
                  href="#registro"
                  className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <i className="fas fa-rocket"></i>
                  Comenzar prueba gratis
                </a>
                <a
                  href="#beneficios"
                  className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
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

            {/* Phone Mockup */}
            <div className="flex justify-center lg:justify-end relative">
              {/* Decorative elements behind phone */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-gradient-to-br from-[#2ECC71]/20 to-transparent rounded-full blur-3xl -z-10"></div>
              
              <div className="phone-mockup">
                <div className="phone-screen bg-gray-50">
                  {/* Mockup Header */}
                  <div className="bg-gradient-to-r from-[#2ECC71] to-[#27ae60] text-white p-4 pt-10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/25 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <i className="fas fa-store text-white text-sm sm:text-base"></i>
                      </div>
                      <div>
                        <p className="font-bold text-xs sm:text-sm">
                          {subdomain.trim() || "Tu Negocio"}
                        </p>
                        <p className="text-xs text-white/85">Catálogo Online</p>
                      </div>
                    </div>
                  </div>

                  {/* Mockup Products Grid */}
                  <div className="p-3 sm:p-4">
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-md hover:shadow-lg transition-shadow duration-300">
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
      <section id="beneficios" className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white relative">
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
      <section id="como-funciona" className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F9FAFB] via-white to-[#F9FAFB] relative">
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
            <div className="text-center group">
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
            <div className="text-center group">
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
            <div className="text-center group">
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

      {/* ==================== PRECIOS ==================== */}
      <section id="precios" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F9FAFB] via-white to-[#2ECC71]/5 relative overflow-hidden">
        {/* Background decoration */}
        <div className="gradient-orb w-[600px] h-[600px] -bottom-40 -right-40 opacity-40"></div>
        <div className="gradient-orb w-[400px] h-[400px] top-1/4 -left-20 opacity-30"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 badge-new mb-6">
              <i className="fas fa-tag"></i>
              <span>Precios</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 px-4">
              Un plan, todo incluido
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Sin complicaciones. Sin costos ocultos. Todo lo que necesitas para vender.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="pricing-grid">
            {/* Single Pricing Card */}
            <div className="pricing-card-popular rounded-[32px] p-6 sm:p-8">
              <div className="pricing-content">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <span className="savings-badge">
                      <i className="fas fa-gift"></i>
                      1 MES GRATIS
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-3">
                    Plan Emprendedor
                  </h3>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-2xl sm:text-3xl text-white/70 line-through font-bold">RD$500</span>
                    <div className="flex items-baseline gap-1">
                      <span className="price-number text-5xl sm:text-6xl font-black">RD$0</span>
                      <span className="text-white/80 text-base sm:text-lg font-medium">/mes</span>
                    </div>
                  </div>
                  <p className="text-white/90 text-xs sm:text-sm">
                    Después: <span className="font-bold">RD$500/mes</span>
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6 flex-grow">
                  <div className="pricing-check">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-white text-[10px]"></i>
                    </div>
                    <span>Productos ilimitados</span>
                  </div>
                  <div className="pricing-check">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-white text-[10px]"></i>
                    </div>
                    <span>Catálogo sin restricciones</span>
                  </div>
                  <div className="pricing-check">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-white text-[10px]"></i>
                    </div>
                    <span>Pedidos por WhatsApp</span>
                  </div>
                  <div className="pricing-check">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-white text-[10px]"></i>
                    </div>
                    <span>Enlace personalizado</span>
                  </div>
                  <div className="pricing-check">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-white text-[10px]"></i>
                    </div>
                    <span>Estadísticas en tiempo real</span>
                  </div>
                  <div className="pricing-check">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-white text-[10px]"></i>
                    </div>
                    <span>Soporte prioritario 24/7</span>
                  </div>
                  <div className="pricing-check">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-white text-[10px]"></i>
                    </div>
                    <span>0% comisiones</span>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href="#registro"
                  className="btn-secondary w-full block text-center font-bold text-sm py-3"
                >
                  <i className="fas fa-rocket mr-1"></i>
                  Comenzar gratis
                </a>
                
                <p className="text-xs text-white/70 text-center mt-3">
                  1 mes gratis · Luego RD$500/mes
                </p>
              </div>
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
              <div className="text-left sm:text-left">
                <p className="font-bold text-gray-900 text-base sm:text-lg">Garantía de satisfacción</p>
                <p className="text-xs sm:text-sm text-gray-600">Cancela cuando quieras · Sin preguntas</p>
              </div>
            </div>
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
            <form onSubmit={handleSubmit} className="card-surface p-6 sm:p-10 lg:p-12">
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
                    placeholder="Ej: Boutique María"
                    className="input-interactive text-sm sm:text-base"
                    required
                  />
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
                    placeholder="tu@correo.com"
                    className="input-interactive text-sm sm:text-base"
                    required
                  />
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
                    placeholder="+1 (809) 000-0000"
                    className="input-interactive text-sm sm:text-base"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm sm:text-base"
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
                  <a href="#" className="text-[#2ECC71] hover:underline font-medium">Términos</a>
                  {" "}y{" "}
                  <a href="#" className="text-[#2ECC71] hover:underline font-medium">Política de Privacidad</a>
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
              <a
                href="#"
                className="btn-primary inline-flex items-center gap-3 text-sm sm:text-base"
              >
                <i className="fas fa-inbox"></i>
                Revisar mi correo
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="logo-container">
                <i className="fas fa-link text-white text-lg"></i>
              </div>
              <span className="text-xl sm:text-2xl font-black">TuLink</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8">
              <a href="#" className="text-sm sm:text-base text-gray-400 hover:text-[#2ECC71] transition-colors font-medium">
                Términos
              </a>
              <a href="#" className="text-sm sm:text-base text-gray-400 hover:text-[#2ECC71] transition-colors font-medium">
                Privacidad
              </a>
              <a href="#" className="text-sm sm:text-base text-gray-400 hover:text-[#2ECC71] transition-colors font-medium">
                Contacto
              </a>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 sm:gap-4">
              <a href="#" className="social-btn w-10 h-10 sm:w-12 sm:h-12" aria-label="Instagram">
                <i className="fab fa-instagram text-white text-sm sm:text-base"></i>
              </a>
              <a href="#" className="social-btn w-10 h-10 sm:w-12 sm:h-12" aria-label="Facebook">
                <i className="fab fa-facebook-f text-white text-sm sm:text-base"></i>
              </a>
              <a href="#" className="social-btn w-10 h-10 sm:w-12 sm:h-12" aria-label="TikTok">
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
