"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

interface FormErrors {
  email?: string;
  password?: string;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, resetPassword } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  // Validate individual field
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "email":
        if (!value.trim()) return "El correo electrónico es requerido";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Ingresa un correo válido";
        return undefined;
      case "password":
        if (!value.trim()) return "La contraseña es requerida";
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

    // Clear error when user types
    if (touchedFields[name] && formErrors[name as keyof FormErrors]) {
      const error = validateField(name, value);
      setFormErrors({ ...formErrors, [name]: error });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all fields
    const newErrors: FormErrors = {};
    (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      setTouchedFields({
        email: true,
        password: true,
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await login({
      email: formData.email,
      password: formData.password,
    });

    setIsSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Redirect to the page user was trying to access, or dashboard
    const redirectTo = searchParams.get("redirect") || "/dashboard";
    router.push(redirectTo);
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(false);

    if (!resetEmail.trim()) {
      setResetError("El correo electrónico es requerido");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setResetError("Ingresa un correo válido");
      return;
    }

    setResetSubmitting(true);

    const { error } = await resetPassword(resetEmail);

    setResetSubmitting(false);

    if (error) {
      setResetError(error.message);
      return;
    }

    setResetSuccess(true);
    setTimeout(() => {
      setShowResetModal(false);
      setResetSuccess(false);
      setResetEmail("");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2ECC71]/5 via-white to-[#2ECC71]/10 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2ECC71] to-[#27ae60] rounded-xl flex items-center justify-center shadow-lg shadow-[#2ECC71]/30 transition-transform duration-300 group-hover:scale-105">
              <i className="fas fa-link text-white text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-gray-900">TuLink</span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="card-surface p-8 sm:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Iniciar sesión
            </h1>
            <p className="text-gray-600">
              Ingresa a tu cuenta de TuLink
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in-up">
              <i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="form-label">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleFieldBlur("email")}
                className={`input-interactive ${
                  touchedFields.email && formErrors.email ? "border-[#EF4444]" : ""
                }`}
                placeholder="tu@email.com"
                aria-invalid={touchedFields.email && !!formErrors.email}
                aria-describedby={formErrors.email ? "email-error" : undefined}
              />
              {touchedFields.email && formErrors.email && (
                <p id="email-error" className="mt-2 text-sm text-[#EF4444] flex items-center gap-1.5 animate-scale-in">
                  <i className="fas fa-exclamation-circle text-xs"></i>
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="form-label mb-0">
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowResetModal(true);
                    setResetEmail(formData.email);
                  }}
                  className="text-sm text-[#2ECC71] font-semibold hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => handleFieldBlur("password")}
                  className={`input-interactive pr-12 ${
                    touchedFields.password && formErrors.password ? "border-[#EF4444]" : ""
                  }`}
                  placeholder="Tu contraseña"
                  aria-invalid={touchedFields.password && !!formErrors.password}
                  aria-describedby={formErrors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2ECC71] transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <i className={`fas fa-${showPassword ? "eye-slash" : "eye"}`}></i>
                </button>
              </div>
              {touchedFields.password && formErrors.password && (
                <p id="password-error" className="mt-2 text-sm text-[#EF4444] flex items-center gap-1.5 animate-scale-in">
                  <i className="fas fa-exclamation-circle text-xs"></i>
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Iniciar sesión</span>
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link
                href="/registro"
                className="text-[#2ECC71] font-semibold hover:underline"
              >
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-[#2ECC71] transition-colors inline-flex items-center gap-2"
          >
            <i className="fas fa-arrow-left"></i>
            Volver al inicio
          </Link>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[24px] shadow-2xl max-w-md w-full p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Restablecer contraseña
              </h2>
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setResetError(null);
                  setResetSuccess(false);
                  setResetEmail("");
                }}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all"
              >
                <i className="fas fa-times text-gray-600"></i>
              </button>
            </div>

            {resetSuccess ? (
              <div className="text-center">
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-[12px]">
                  <i className="fas fa-check-circle text-green-500 text-3xl mb-2"></i>
                  <p className="text-sm text-green-800">
                    ¡Correo enviado! Revisa tu bandeja de entrada para restablecer tu contraseña.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {resetError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-[12px] flex items-start gap-3">
                    <i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
                    <p className="text-sm text-red-700">{resetError}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="reset-email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-[12px] border border-gray-300 focus:border-[#2ECC71] focus:ring-2 focus:ring-[#2ECC71]/20 outline-none transition-all"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <p className="text-sm text-gray-600">
                  Te enviaremos un correo con un enlace para restablecer tu contraseña.
                </p>

                <button
                  type="submit"
                  disabled={resetSubmitting}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {resetSubmitting ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin"></i>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      <span>Enviar correo de restablecimiento</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <i className="fas fa-circle-notch fa-spin text-4xl text-[#2ECC71] mb-4"></i>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
