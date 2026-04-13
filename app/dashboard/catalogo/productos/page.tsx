"use client";

import { useState, useEffect, useRef, ChangeEvent, useCallback } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { createClient } from "@/lib/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
  is_active: boolean;
  category_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
}

export default function ProductosPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "0",
    category_id: "",
    is_active: true,
    sort_order: 0,
  });
  const [imageFile, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch products - memoized to avoid re-creation on every render
  const fetchProducts = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      let query = supabase
        .from("products")
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true });

      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError("Error al cargar los productos: " + message);
    } finally {
      setLoading(false);
    }
  }, [user, selectedCategory]);

  const fetchCategories = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      console.error("Error loading categories:", message);
    }
  }, [user]);

  // Fetch products and categories when user changes
  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchCategories();
    }
  }, [user, fetchProducts, fetchCategories]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "0",
      category_id: "",
      is_active: true,
      sort_order: products.length,
    });
    setFile(null);
    setImagePreview(null);
    setError(null);
    setSuccess(null);
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      category_id: product.category_id || "",
      is_active: product.is_active,
      sort_order: product.sort_order,
    });
    setFile(null);
    setImagePreview(product.image_url);
    setError(null);
    setSuccess(null);
    setShowModal(true);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) return null;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("Debes iniciar sesión");
      return;
    }

    if (!formData.name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      setError("El precio debe ser mayor o igual a 0");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      let imageUrl = imagePreview;

      // Upload image if a new file was selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const stockValue = parseInt(formData.stock) || 0;
      // Auto-deactivate if stock is 0
      const isActive = stockValue > 0 ? formData.is_active : false;

      const productData = {
        user_id: user.id,
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        image_url: imageUrl || null,
        stock: stockValue,
        is_active: isActive,
        category_id: formData.category_id || null,
        sort_order: formData.sort_order,
      };

      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;
        setSuccess("Producto actualizado exitosamente");
      } else {
        // Create new product
        const { error } = await supabase
          .from("products")
          .insert(productData);

        if (error) throw error;
        setSuccess("Producto creado exitosamente");
      }

      setShowModal(false);
      fetchProducts();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError("Error al guardar: " + message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      if (error) throw error;
      setSuccess("Producto eliminado exitosamente");
      fetchProducts();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError("Error al eliminar: " + message);
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const newIsActive = !product.is_active;
      const { error } = await supabase
        .from("products")
        .update({ is_active: newIsActive })
        .eq("id", product.id);

      if (error) throw error;
      fetchProducts();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError("Error al actualizar: " + message);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(price);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
            <i className="fas fa-box text-[#2ECC71] mr-3"></i>
            Productos
          </h1>
          <p className="text-lg text-gray-600">
            Gestiona tu inventario de productos
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary px-6 py-3 text-base whitespace-nowrap"
        >
          <i className="fas fa-plus mr-2"></i>
          Nuevo Producto
        </button>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-gray-700">
              Filtrar por categoría:
            </span>
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-[12px] text-sm font-semibold transition-all ${
                selectedCategory === "all"
                  ? "bg-gradient-to-br from-[#2ECC71] to-[#27ae60] text-white shadow-lg shadow-[#2ECC71]/30"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Todas
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-[12px] text-sm font-semibold transition-all ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-br from-[#2ECC71] to-[#27ae60] text-white shadow-lg shadow-[#2ECC71]/30"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

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

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <i className="fas fa-circle-notch fa-spin text-4xl text-[#2ECC71]"></i>
        </div>
      ) : products.length === 0 ? (
        <div className="card-surface p-12 text-center">
          <div className="icon-squircle mx-auto mb-4">
            <i className="fas fa-box-open text-4xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No hay productos aún
          </h3>
          <p className="text-gray-600 mb-6">
            Crea tu primer producto para comenzar a vender
          </p>
          <button
            onClick={openCreateModal}
            className="btn-primary px-6 py-3"
          >
            <i className="fas fa-plus mr-2"></i>
            Crear primer producto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="card-surface overflow-hidden hover:translate-y-[-8px] transition-transform duration-300"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="fas fa-image text-6xl text-gray-400"></i>
                )}
                {!product.is_active && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="px-4 py-2 bg-red-500 text-white font-bold rounded-full">
                      No disponible
                    </span>
                  </div>
                )}
                {product.stock === 0 && product.is_active && (
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                      Sin stock
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 flex-1">
                    {product.name}
                  </h3>
                </div>
                
                {product.categories && (
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 bg-[#2ECC71]/10 text-[#2ECC71] text-xs font-semibold rounded-full">
                      {product.categories.name}
                    </span>
                  </div>
                )}

                {product.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-[#2ECC71]">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-gray-600">
                    Stock: <span className="font-bold text-gray-900">{product.stock}</span>
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(product)}
                    className={`flex-1 px-3 py-2 text-sm rounded-[12px] transition-all ${
                      product.is_active
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                    title={product.is_active ? "Desactivar" : "Activar"}
                  >
                    <i className={`fas ${product.is_active ? "fa-ban" : "fa-check"} mr-1`}></i>
                    {product.is_active ? "Activo" : "Inactivo"}
                  </button>
                  <button
                    onClick={() => openEditModal(product)}
                    className="px-3 py-2 text-sm rounded-[12px] bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all"
                    title="Editar"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="px-3 py-2 text-sm rounded-[12px] bg-red-100 text-red-700 hover:bg-red-200 transition-all"
                    title="Eliminar"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-[24px] shadow-2xl max-w-2xl w-full p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all"
              >
                <i className="fas fa-times text-gray-600"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Foto del producto
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-48 rounded-[12px] border-2 border-dashed border-gray-300 hover:border-[#2ECC71] cursor-pointer transition-all overflow-hidden bg-gray-50"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <i className="fas fa-cloud-upload-alt text-4xl mb-2"></i>
                      <p className="text-sm">Haz clic para subir una imagen</p>
                      <p className="text-xs text-gray-400">JPG, PNG o WebP</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setImagePreview(editingProduct?.image_url || null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-700"
                  >
                    <i className="fas fa-times mr-1"></i>
                    Quitar imagen
                  </button>
                )}
              </div>

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
                  placeholder="Ej: Camiseta, Smartphone, Pastel..."
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
                  placeholder="Descripción del producto..."
                />
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Precio (RD$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-[12px] border border-gray-300 focus:border-[#2ECC71] focus:ring-2 focus:ring-[#2ECC71]/20 outline-none transition-all"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Stock disponible *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-3 rounded-[12px] border border-gray-300 focus:border-[#2ECC71] focus:ring-2 focus:ring-[#2ECC71]/20 outline-none transition-all"
                    placeholder="0"
                    required
                  />
                  {parseInt(formData.stock) === 0 && (
                    <p className="mt-1 text-xs text-yellow-600">
                      <i className="fas fa-exclamation-triangle mr-1"></i>
                      Con stock 0, el producto se marcará como no disponible
                    </p>
                  )}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Categoría
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-[12px] border border-gray-300 focus:border-[#2ECC71] focus:ring-2 focus:ring-[#2ECC71]/20 outline-none transition-all"
                >
                  <option value="">Sin categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Status */}
              {parseInt(formData.stock) > 0 && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-[#2ECC71] focus:ring-[#2ECC71]"
                  />
                  <label htmlFor="is_active" className="text-sm font-semibold text-gray-900">
                    Producto activo
                  </label>
                </div>
              )}

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
                  disabled={submitting || uploading}
                  className="flex-1 btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting || uploading ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin mr-2"></i>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      {editingProduct ? "Actualizar" : "Crear"}
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
