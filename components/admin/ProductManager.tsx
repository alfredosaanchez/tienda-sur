"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabaseClient";
import type { Category, Product } from "@/types";

const emptyForm = {
  id: null as string | null,
  name: "",
  description: "",
  price: "",
  discount_percent: "",
  category_id: "",
};

export default function ProductManager({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const supabase = createClient();
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
  };

  const startEdit = (product: Product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description ?? "",
      price: String(product.price),
      discount_percent: String(product.discount_percent ?? 0),
      category_id: product.category_id ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, imageFile, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      throw new Error("No se pudo subir la imagen.");
    }

    const { data } = supabase.storage.from("products").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.price) {
      setError("Nombre y precio son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: parseFloat(form.price),
        discount_percent: form.discount_percent
          ? parseFloat(form.discount_percent)
          : 0,
        category_id: form.category_id || null,
        ...(imageUrl ? { image_url: imageUrl } : {}),
      };

      if (form.id) {
        // Editar producto existente
        const { data, error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", form.id)
          .select("*, categories(*)")
          .single();
        if (error) throw error;
        setProducts((prev) =>
          prev.map((p) => (p.id === form.id ? (data as Product) : p))
        );
      } else {
        // Crear producto nuevo
        const { data, error } = await supabase
          .from("products")
          .insert(payload)
          .select("*, categories(*)")
          .single();
        if (error) throw error;
        setProducts((prev) => [data as Product, ...prev]);
      }

      resetForm();
    } catch (err) {
      setError("Ocurrió un error guardando el producto. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("¿Eliminar este producto?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-6">
      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-surface rounded-xl2 shadow-neu p-6 h-fit"
      >
        <h2 className="font-display text-xl mb-4">
          {form.id ? "Editar producto" : "Nuevo producto"}
        </h2>

        <label className="block text-sm mb-1.5 text-ink-soft">Nombre</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full mb-4 px-4 py-2.5 rounded-xl bg-bg shadow-neu-inset outline-none focus:ring-2 focus:ring-accent text-sm"
          placeholder="Camisa lino blanca"
        />

        <label className="block text-sm mb-1.5 text-ink-soft">Descripción</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full mb-4 px-4 py-2.5 rounded-xl bg-bg shadow-neu-inset outline-none focus:ring-2 focus:ring-accent text-sm resize-none"
          rows={3}
        />

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm mb-1.5 text-ink-soft">Precio</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-bg shadow-neu-inset outline-none focus:ring-2 focus:ring-accent text-sm"
              placeholder="25.50"
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5 text-ink-soft">Descuento %</label>
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              value={form.discount_percent}
              onChange={(e) =>
                setForm({ ...form, discount_percent: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-bg shadow-neu-inset outline-none focus:ring-2 focus:ring-accent text-sm"
              placeholder="0"
            />
          </div>
        </div>

        <label className="block text-sm mb-1.5 text-ink-soft">Categoría</label>
        <select
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          className="w-full mb-4 px-4 py-2.5 rounded-xl bg-bg shadow-neu-inset outline-none focus:ring-2 focus:ring-accent text-sm"
        >
          <option value="">Sin categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label className="block text-sm mb-1.5 text-ink-soft">
          Imagen {form.id && "(dejar vacío para no cambiarla)"}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="w-full mb-4 text-sm"
        />

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <div className="flex gap-2">
          <button
            disabled={loading}
            className="flex-1 py-2.5 rounded-full bg-ink text-bg text-sm shadow-neu-sm disabled:opacity-50"
          >
            {loading ? "Guardando..." : form.id ? "Guardar cambios" : "Crear producto"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 rounded-full bg-bg shadow-neu-sm text-sm text-ink-soft"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista de productos */}
      <div className="bg-surface rounded-xl2 shadow-neu p-6">
        <h2 className="font-display text-xl mb-4">
          Productos ({products.length})
        </h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-bg rounded-xl shadow-neu-sm p-3 flex flex-col"
            >
              <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-surface mb-2">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-ink-soft">
                    Sin imagen
                  </div>
                )}
              </div>
              <p className="text-sm font-medium leading-tight">{product.name}</p>
              <p className="text-xs text-ink-soft mb-2">
                {product.categories?.name ?? "Sin categoría"} · $
                {Number(product.price).toFixed(2)}
              </p>
              <div className="mt-auto flex gap-2">
                <button
                  onClick={() => startEdit(product)}
                  className="flex-1 text-xs py-1.5 rounded-full bg-surface shadow-neu-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 text-xs py-1.5 rounded-full bg-surface shadow-neu-sm text-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-sm text-ink-soft">Aún no hay productos.</p>
          )}
        </div>
      </div>
    </div>
  );
}
