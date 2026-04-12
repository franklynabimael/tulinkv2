"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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

    // Redirect to dashboard
    router.push("/dashboard");
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
    </div>
  );
}
