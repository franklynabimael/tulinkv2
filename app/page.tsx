"use client";

import { useState, useEffect } from "react";

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
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#2ECC71] rounded-xl flex items-center justify-center">
                <i className="fas fa-link text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold text-gray-900">TuLink</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#beneficios" className="text-gray-600 hover:text-[#2ECC71] transition-colors font-medium">
                Beneficios
              </a>
              <a href="#como-funciona" className="text-gray-600 hover:text-[#2ECC71] transition-colors font-medium">
                Cómo Funciona
              </a>
              <a href="#precios" className="text-gray-600 hover:text-[#2ECC71] transition-colors font-medium">
                Precios
              </a>
            </div>

            {/* Mobile Navigation Links */}
            <div className="hidden md:flex lg:hidden items-center gap-6">
              <a href="#precios" className="text-gray-600 hover:text-[#2ECC71] transition-colors font-medium">
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
              className="lg:hidden p-2 text-gray-600 hover:text-[#2ECC71]"
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
                className="p-2 text-gray-600 hover:text-[#2ECC71]"
                aria-label="Cerrar menú"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <a 
                href="#beneficios" 
                className="block py-3 text-gray-600 hover:text-[#2ECC71] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Beneficios
              </a>
              <a 
                href="#como-funciona" 
                className="block py-3 text-gray-600 hover:text-[#2ECC71] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cómo Funciona
              </a>
              <a 
                href="#precios" 
                className="block py-3 text-gray-600 hover:text-[#2ECC71] font-medium"
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
      <section className="pt-16 lg:pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#2ECC71]/5 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#2ECC71]/10 text-[#2ECC71] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <i className="fas fa-sparkles"></i>
                <span>Prueba gratis por 1 mes</span>
              </div>
              
              <h1 className="hero-headline mb-6">
                Tu catálogo virtual,{" "}
                <span className="text-[#2ECC71]">pedidos por WhatsApp</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                La plataforma SaaS que te permite crear tu tienda online en minutos,
                mostrar tus productos y recibir pedidos directamente en tu WhatsApp.
                Sin comisiones por venta.
              </p>

              {/* Subdomain Builder */}
              <div className="subdomain-builder mb-6">
                <input
                  type="text"
                  placeholder="tu-negocio"
                  value={subdomain}
                  onChange={handleSubdomainChange}
                  className="subdomain-input"
                  maxLength={20}
                />
                <div className="subdomain-suffix">
                  .tulink.do
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-8">
                Tu enlace personalizado te espera · Sin tarjeta de crédito
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#registro"
                  className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2"
                >
                  <i className="fas fa-rocket"></i>
                  Comenzar prueba gratis
                </a>
                <a
                  href="#beneficios"
                  className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2"
                >
                  <i className="fas fa-play-circle"></i>
                  Ver características
                </a>
              </div>
            </div>

            {/* Phone Mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="phone-mockup">
                <div className="phone-screen bg-gray-50">
                  {/* Mockup Header */}
                  <div className="bg-[#2ECC71] text-white p-4 pt-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <i className="fas fa-store"></i>
                      </div>
                      <div>
                        <p className="font-bold text-sm">
                          {subdomain.trim() || "Tu Negocio"}
                        </p>
                        <p className="text-xs text-white/80">Catálogo Online</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mockup Products Grid */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="bg-white rounded-xl p-3 shadow-sm">
                          <div className="w-full h-20 bg-gray-200 rounded-lg mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Mockup CTA */}
                    <div className="mt-4 bg-[#2ECC71] text-white text-center py-3 rounded-xl font-semibold">
                      <i className="fab fa-whatsapp mr-2"></i>
                      Pedir por WhatsApp
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== BENEFICIOS (Pain Cards) ==================== */}
      <section id="beneficios" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Resolvemos tus problemas de venta
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Diseñado por vendedores, para vendedores
            </p>
          </div>

          <div className="benefits-grid">
            {/* Beneficio 1 - Desorden de Inventario */}
            <div className="card-surface p-8 card-hover">
              <div className="icon-squircle mb-6">
                <i className="fas fa-images text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Adiós al desorden de inventario
              </h3>
              <p className="text-gray-600 mb-4">
                Evita subir fotos repetitivas a estados de WhatsApp o feeds de Instagram. 
                Todo tu catálogo organizado en un solo lugar.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <i className="fas fa-check text-[#2ECC71]"></i>
                  Productos siempre actualizados
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <i className="fas fa-check text-[#2ECC71]"></i>
                  Sin fotos duplicadas
                </li>
              </ul>
            </div>

            {/* Beneficio 2 - Saturación de DMs */}
            <div className="card-surface p-8 card-hover">
              <div className="icon-squircle mb-6">
                <i className="fas fa-comments text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Elimina la saturación de DMs
              </h3>
              <p className="text-gray-600 mb-4">
                Reduce el flujo constante de preguntas sobre precios y disponibilidad. 
                Tus clientes encuentran todo en tu catálogo.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <i className="fas fa-check text-[#2ECC71]"></i>
                  Menos mensajes repetitivos
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <i className="fas fa-check text-[#2ECC71]"></i>
                  Información siempre disponible
                </li>
              </ul>
            </div>

            {/* Beneficio 3 - Fricción de Compra */}
            <div className="card-surface p-8 card-hover">
              <div className="icon-squircle mb-6">
                <i className="fas fa-shopping-cart text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Automatiza la toma de pedidos
              </h3>
              <p className="text-gray-600 mb-4">
                El carrito se envía directamente a tu WhatsApp con todos los detalles 
                del pedido. Cierra ventas más rápido.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <i className="fas fa-check text-[#2ECC71]"></i>
                  Pedidos estructurados
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <i className="fas fa-check text-[#2ECC71]"></i>
                  Integración con WhatsApp
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CÓMO FUNCIONA (3 Pasos) ==================== */}
      <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Empieza a vender en 3 pasos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tan simple que cualquier persona puede usarlo
            </p>
          </div>

          <div className="flow-steps">
            {/* Paso 1 - Sube */}
            <div className="text-center">
              <div className="w-20 h-20 bg-[#2ECC71] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg shadow-[#2ECC71]/30">
                1
              </div>
              <div className="icon-squircle mb-6">
                <i className="fas fa-cloud-upload-alt text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Sube tu catálogo
              </h3>
              <p className="text-gray-600">
                Gestiona tu catálogo masivo de productos. Añade fotos, descripciones 
                y precios en minutos.
              </p>
            </div>

            {/* Paso 2 - Comparte */}
            <div className="text-center">
              <div className="w-20 h-20 bg-[#2ECC71] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg shadow-[#2ECC71]/30">
                2
              </div>
              <div className="icon-squircle mb-6">
                <i className="fas fa-share-alt text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Comparte tu enlace
              </h3>
              <p className="text-gray-600">
                Distribuye tu enlace personalizado en tu bio de Instagram, TikTok, 
                Facebook y estados de WhatsApp.
              </p>
            </div>

            {/* Paso 3 - Vende */}
            <div className="text-center">
              <div className="w-20 h-20 bg-[#2ECC71] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg shadow-[#2ECC71]/30">
                3
              </div>
              <div className="icon-squircle mb-6">
                <i className="fab fa-whatsapp text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Recibe pedidos
              </h3>
              <p className="text-gray-600">
                Los clientes seleccionan productos y el pedido llega estructurado 
                directamente a tu WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PRECIOS ==================== */}
      <section id="precios" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Planes simples y transparentes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Elige el plan perfecto para tu negocio · Sin sorpresas
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plan Gratis */}
            <div className="card-surface p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gray-200 text-gray-700 px-4 py-1 rounded-bl-2xl font-semibold text-sm">
                Para empezar
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan Básico</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold text-gray-900">RD$0</span>
                  <span className="text-gray-600">/mes</span>
                </div>
                <p className="text-gray-600">Ideal para probar TuLink</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <i className="fas fa-check text-[#2ECC71] mt-1"></i>
                  <span className="text-gray-700">Hasta 10 productos</span>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fas fa-check text-[#2ECC71] mt-1"></i>
                  <span className="text-gray-700">Catálogo básico</span>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fas fa-check text-[#2ECC71] mt-1"></i>
                  <span className="text-gray-700">Pedidos por WhatsApp</span>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fas fa-check text-[#2ECC71] mt-1"></i>
                  <span className="text-gray-700">Enlace personalizado .tulink.do</span>
                </div>
                <div className="flex items-start gap-3 opacity-50">
                  <i className="fas fa-times text-gray-400 mt-1"></i>
                  <span className="text-gray-400">Estadísticas de ventas</span>
                </div>
                <div className="flex items-start gap-3 opacity-50">
                  <i className="fas fa-times text-gray-400 mt-1"></i>
                  <span className="text-gray-400">Soporte prioritario</span>
                </div>
                <div className="flex items-start gap-3 opacity-50">
                  <i className="fas fa-times text-gray-400 mt-1"></i>
                  <span className="text-gray-400">Personalización avanzada</span>
                </div>
              </div>

              <a
                href="#registro"
                className="btn-secondary w-full block text-center"
              >
                Comenzar gratis
              </a>
            </div>

            {/* Plan Premium */}
            <div className="card-surface p-8 relative overflow-hidden border-2 border-[#2ECC71] shadow-lg shadow-[#2ECC71]/10">
              <div className="absolute top-0 right-0 bg-[#2ECC71] text-white px-4 py-1 rounded-bl-2xl font-semibold text-sm">
                Más popular
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan Emprendedor</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold text-gray-900">RD$500</span>
                  <span className="text-gray-600">/mes</span>
                </div>
                <p className="text-gray-600">Todo ilimitado para crecer</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <i className="fas fa-check text-[#2ECC71] mt-1"></i>
                  <span className="text-gray-700 font-semibold">Productos ilimitados</span>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fas fa-check text-[#2ECC71] mt-1"></i>
                  <span className="text-gray-700">Catálogo completo</span>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fas fa-check text-[#2ECC71] mt-1"></i>
                  <span className="text-gray-700">Pedidos por WhatsApp</span>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fas fa-check text-[#2ECC71] mt-1"></i>
                  <span className="text-gray-700">Enlace personalizado .tulink.do</span>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fas fa-check text-[#2ECC71] mt-1"></i>
                  <span className="text-gray-700">Estadísticas de ventas</span>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fas fa-check text-[#2ECC71] mt-1"></i>
                  <span className="text-gray-700">Soporte prioritario 24/7</span>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fas fa-check text-[#2ECC71] mt-1"></i>
                  <span className="text-gray-700">Personalización avanzada</span>
                </div>
              </div>

              <a
                href="#registro"
                className="btn-primary w-full block text-center"
              >
                Comenzar prueba de 1 mes
              </a>
              <p className="text-xs text-gray-500 text-center mt-3">
                1 mes gratis · Luego RD$500/mes
              </p>
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="mt-16 card-surface overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Característica</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Básico</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Emprendedor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-6 py-4 text-gray-700">Productos</td>
                    <td className="px-6 py-4 text-center text-gray-600">10</td>
                    <td className="px-6 py-4 text-center text-gray-900 font-semibold">Ilimitados</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700">Pedidos por WhatsApp</td>
                    <td className="px-6 py-4 text-center"><i className="fas fa-check text-[#2ECC71]"></i></td>
                    <td className="px-6 py-4 text-center"><i className="fas fa-check text-[#2ECC71]"></i></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700">Enlace personalizado</td>
                    <td className="px-6 py-4 text-center"><i className="fas fa-check text-[#2ECC71]"></i></td>
                    <td className="px-6 py-4 text-center"><i className="fas fa-check text-[#2ECC71]"></i></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700">Estadísticas de ventas</td>
                    <td className="px-6 py-4 text-center"><i className="fas fa-times text-gray-300"></i></td>
                    <td className="px-6 py-4 text-center"><i className="fas fa-check text-[#2ECC71]"></i></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700">Soporte prioritario</td>
                    <td className="px-6 py-4 text-center"><i className="fas fa-times text-gray-300"></i></td>
                    <td className="px-6 py-4 text-center"><i className="fas fa-check text-[#2ECC71]"></i></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700">Personalización avanzada</td>
                    <td className="px-6 py-4 text-center"><i className="fas fa-times text-gray-300"></i></td>
                    <td className="px-6 py-4 text-center"><i className="fas fa-check text-[#2ECC71]"></i></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700">Sin comisiones por venta</td>
                    <td className="px-6 py-4 text-center"><i className="fas fa-check text-[#2ECC71]"></i></td>
                    <td className="px-6 py-4 text-center"><i className="fas fa-check text-[#2ECC71]"></i></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Guarantee */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-[#2ECC71]/10 px-6 py-4 rounded-2xl">
              <i className="fas fa-shield-heart text-[#2ECC71] text-2xl"></i>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Garantía de satisfacción</p>
                <p className="text-sm text-gray-600">Cancela cuando quieras · Sin preguntas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FORMULARIO DE CAPTACIÓN ==================== */}
      <section id="registro" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Comienza tu prueba gratis
            </h2>
            <p className="text-xl text-gray-600">
              1 mes gratis · Sin tarjeta de crédito · Cancela cuando quieras
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="card-surface p-8 lg:p-10">
              <div className="space-y-6">
                {/* Business Name */}
                <div>
                  <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre de tu negocio *
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Ej: Boutique María"
                    className="input-interactive"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu@correo.com"
                    className="input-interactive"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (809) 000-0000"
                    className="input-interactive"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

                <p className="text-xs text-gray-500 text-center">
                  Al registrarte, aceptas nuestros{" "}
                  <a href="#" className="text-[#2ECC71] hover:underline">Términos</a>
                  {" "}y{" "}
                  <a href="#" className="text-[#2ECC71] hover:underline">Política de Privacidad</a>
                </p>
              </div>
            </form>
          ) : (
            <div id="success-message" className="card-surface p-8 lg:p-10 text-center">
              <div className="w-20 h-20 bg-[#2ECC71]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-check text-3xl text-[#2ECC71]"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ¡Bienvenido a TuLink!
              </h3>
              <p className="text-gray-600 mb-6">
                Hemos recibido tu registro. Pronto recibirás un correo con los 
                siguientes pasos para configurar tu catálogo.
              </p>
              <a
                href="#"
                className="btn-primary inline-flex items-center gap-2"
              >
                <i className="fas fa-inbox"></i>
                Revisar mi correo
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#2ECC71] rounded-xl flex items-center justify-center">
                <i className="fas fa-link text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold">TuLink</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 lg:gap-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Términos
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Contacto
              </a>
            </div>

            {/* Social */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#2ECC71] transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#2ECC71] transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#2ECC71] transition-colors">
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center lg:text-left">
            <p className="text-gray-400 text-sm">
              © 2026 TuLink. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
