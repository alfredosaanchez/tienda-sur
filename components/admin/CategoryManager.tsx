"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import type { Category } from "@/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CategoryManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const supabase = createClient();
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("categories")
      .insert({ name: name.trim(), slug: slugify(name) })
      .select()
      .single();

    setLoading(false);

    if (error) {
      setError("No se pudo crear la categoría (¿ya existe?).");
      return;
    }

    setCategories((prev) => [...prev, data as Category]);
    setName("");
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "¿Eliminar esta categoría? Los productos asociados quedarán sin categoría."
    );
    if (!confirmDelete) return;

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="bg-surface rounded-xl2 shadow-neu p-6">
      <h2 className="font-display text-xl mb-4">Categorías</h2>

      <form onSubmit={handleAdd} className="flex gap-2 mb-5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nueva categoría (ej: Chaquetas)"
          className="flex-1 px-4 py-2.5 rounded-xl bg-bg shadow-neu-inset outline-none focus:ring-2 focus:ring-accent text-sm"
        />
        <button
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-ink text-bg text-sm shadow-neu-sm disabled:opacity-50"
        >
          Agregar
        </button>
      </form>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <ul className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg shadow-neu-sm text-sm"
          >
            {cat.name}
            <button
              onClick={() => handleDelete(cat.id)}
              aria-label={`Eliminar ${cat.name}`}
              className="text-ink-soft hover:text-red-600"
            >
              ×
            </button>
          </li>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-ink-soft">Aún no hay categorías.</p>
        )}
      </ul>
    </div>
  );
}
