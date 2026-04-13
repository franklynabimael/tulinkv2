"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { createClient } from "@/lib/supabase/client";

interface Category {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function CategoriasPage() {
  const { user } = useAuth();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sort_order: 0,
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch categories - memoized to avoid re-creation on every render
  const fetchCategories = useCallback(async () => {
    if (!user) return;
    
    const supabase = createClient();
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true });

      if (fetchError) {
        console.error("Error fetching categories:", fetchError);
        throw fetchError;
      }
      setCategories(data || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError("Error al cargar las categorías: " + message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch categories when user changes
  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user, fetchCategories]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      sort_order: categories.length,
      is_active: true,
    });
    setError(null);
    setSuccess(null);
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      sort_order: category.sort_order,
      is_active: category.is_active,
    });
    setError(null);
    setSuccess(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    if (!user) {
      setError("Debes iniciar sesión");
      return;
    }

    if (!formData.name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingCategory) {
        // Update existing category
        const { error: updateError } = await supabase
          .from("categories")
          .update({
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            sort_order: formData.sort_order,
            is_active: formData.is_active,
          })
          .eq("id", editingCategory.id);

        if (updateError) throw updateError;
        setSuccess("Categoría actualizada exitosamente");
      } else {
        // Create new category
        const { error: insertError } = await supabase
          .from("categories")
          .insert({
            user_id: user.id,
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            sort_order: formData.sort_order,
            is_active: formData.is_active,
          });

        if (insertError) throw insertError;
        setSuccess("Categoría creada exitosamente");
      }

      setShowModal(false);
      fetchCategories();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      console.error("Error saving category:", err);
      setError("Error al guardar: " + message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    const supabase = createClient();
    if (!confirm(`¿Estás seguro de eliminar "${category.name}"?`)) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from("categories")
        .delete()
        .eq("id", category.id);

      if (deleteError) throw deleteError;
      setSuccess("Categoría eliminada exitosamente");
      fetchCategories();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError("Error al eliminar: " + message);
    }
  };

  const handleToggleActive = async (category: Category) => {
    const supabase = createClient();
    try {
      const { error: toggleError } = await supabase
        .from("categories")
        .update({ is_active: !category.is_active })
        .eq("id", category.id);

      if (toggleError) throw toggleError;
      fetchCategories();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError("Error al actualizar: " + message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
            <i className="fas fa-folder text-[#2ECC71] mr-3"></i>
            Categorías
          </h1>
          <p className="text-lg text-gray-600">
            Organiza tus productos por categorías
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary px-6 py-3 text-base whitespace-nowrap"
        >
          <i className="fas fa-plus mr-2"></i>
          Nueva Categoría
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-[12px] text-green-800">
          <i className="fas fa-check-circle mr-2"></i>
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[12px] text-red-800">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      )}

      {/* Categories List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <i className="fas fa-circle-notch fa-spin text-4xl text-[#2ECC71]"></i>
        </div>
      ) : categories.length === 0 ? (
        <div className="card-surface p-12 text-center">
          <div className="icon-squircle mx-auto mb-4">
            <i className="fas fa-folder-open text-4xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No hay categorías aún
          </h3>
          <p className="text-gray-600 mb-6">
            Crea tu primera categoría para organizar tus productos
          </p>
          <button
            onClick={openCreateModal}
            className="btn-primary px-6 py-3"
          >
            <i className="fas fa-plus mr-2"></i>
            Crear primera categoría
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="card-surface p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2ECC71]/20 to-[#2ECC71]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-folder text-[#2ECC71]"></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {category.name}
                    </h3>
                    {!category.is_active && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-semibold rounded-full">
                        Inactivo
                      </span>
                    )}
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(category)}
                  className={`px-3 py-2 text-sm rounded-[12px] transition-all ${
                    category.is_active
                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                  title={category.is_active ? "Desactivar" : "Activar"}
                >
                  <i className={`fas ${category.is_active ? "fa-ban" : "fa-check"}`}></i>
                </button>
                <button
                  onClick={() => openEditModal(category)}
                  className="px-3 py-2 text-sm rounded-[12px] bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all"
                  title="Editar"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className="px-3 py-2 text-sm rounded-[12px] bg-red-100 text-red-700 hover:bg-red-200 transition-all"
                  title="Eliminar"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[24px] shadow-2xl max-w-lg w-full p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all"
              >
                <i className="fas fa-times text-gray-600"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-[12px] border border-gray-300 focus:border-[#2ECC71] focus:ring-2 focus:ring-[#2ECC71]/20 outline-none transition-all"
                  placeholder="Ej: Ropa, Electrónicos, Alimentos..."
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-[12px] border border-gray-300 focus:border-[#2ECC71] focus:ring-2 focus:ring-[#2ECC71]/20 outline-none transition-all resize-none"
                  rows={3}
                  placeholder="Descripción opcional de la categoría..."
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-[#2ECC71] focus:ring-[#2ECC71]"
                />
                <label htmlFor="is_active" className="text-sm font-semibold text-gray-900">
                  Categoría activa
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary px-6 py-3"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin mr-2"></i>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      {editingCategory ? "Actualizar" : "Crear"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
