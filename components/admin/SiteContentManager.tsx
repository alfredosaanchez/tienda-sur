"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabaseClient";
import type { SiteContent } from "@/types";

export default function SiteContentManager({
  initialContent,
}: {
  initialContent: SiteContent | null;
}) {
  const supabase = createClient();

  const [form, setForm] = useState({
    hero_image_url: initialContent?.hero_image_url ?? "",
    about_title: initialContent?.about_title ?? "Nosotros",
    about_text: initialContent?.about_text ?? "",
    contact_email: initialContent?.contact_email ?? "",
    contact_phone: initialContent?.contact_phone ?? "",
    contact_address: initialContent?.contact_address ?? "",
  });
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const uploadHeroImage = async (): Promise<string | null> => {
    if (!heroFile) return null;
    const fileExt = heroFile.name.split(".").pop();
    const fileName = `hero-${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, heroFile, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      throw new Error("No se pudo subir la imagen del hero.");
    }

    const { data } = supabase.storage.from("products").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      let heroImageUrl = form.hero_image_url;
      if (heroFile) {
        const uploaded = await uploadHeroImage();
        if (uploaded) heroImageUrl = uploaded;
      }

      const { error } = await supabase
        .from("site_content")
        .update({
          hero_image_url: heroImageUrl || null,
          about_title: form.about_title.trim() || "Nosotros",
          about_text: form.about_text.trim() || null,
          contact_email: form.contact_email.trim() || null,
          contact_phone: form.contact_phone.trim() || null,
          contact_address: form.contact_address.trim() || null,
        })
        .eq("id", 1);

      if (error) throw error;

      setForm((prev) => ({ ...prev, hero_image_url: heroImageUrl }));
      setHeroFile(null);
      setSuccess(true);
    } catch (err) {
      setError("Ocurrió un error guardando los cambios. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface rounded-xl2 shadow-neu p-6 mb-6"
    >
      <h2 className="font-display text-xl mb-4">Contenido del sitio</h2>

      {/* Foto del hero */}
      <div className="mb-6">
        <label className="block text-sm mb-2 text-ink-soft">
          Foto principal (portada / "tu foto de campaña aquí")
        </label>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-bg shadow-neu-inset shrink-0">
            {form.hero_image_url ? (
              <Image
                src={form.hero_image_url}
                alt="Foto actual del hero"
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-ink-soft text-center px-1">
                Sin foto
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setHeroFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </div>
      </div>

      {/* Nosotros */}
      <div className="mb-6">
        <label className="block text-sm mb-1.5 text-ink-soft">
          Título de la sección "Nosotros"
        </label>
        <input
          value={form.about_title}
          onChange={(e) => setForm({ ...form, about_title: e.target.value })}
          className="w-full mb-3 px-4 py-2.5 rounded-xl bg-bg shadow-neu-inset outline-none focus:ring-2 focus:ring-accent text-sm"
        />
        <label className="block text-sm mb-1.5 text-ink-soft">
          Texto de "Nosotros"
        </label>
        <textarea
          value={form.about_text}
          onChange={(e) => setForm({ ...form, about_text: e.target.value })}
          rows={4}
          className="w-full px-4 py-2.5 rounded-xl bg-bg shadow-neu-inset outline-none focus:ring-2 focus:ring-accent text-sm resize-none"
          placeholder="Contá aquí la historia de tu marca..."
        />
      </div>

      {/* Contacto */}
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <div>
          <label className="block text-sm mb-1.5 text-ink-soft">Correo</label>
          <input
            value={form.contact_email}
            onChange={(e) =>
              setForm({ ...form, contact_email: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl bg-bg shadow-neu-inset outline-none focus:ring-2 focus:ring-accent text-sm"
            placeholder="contacto@tutienda.com"
          />
        </div>
        <div>
          <label className="block text-sm mb-1.5 text-ink-soft">
            Teléfono / WhatsApp
          </label>
          <input
            value={form.contact_phone}
            onChange={(e) =>
              setForm({ ...form, contact_phone: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl bg-bg shadow-neu-inset outline-none focus:ring-2 focus:ring-accent text-sm"
            placeholder="+52 55 0000 0000"
          />
          <p className="text-xs text-ink-soft mt-1">
            Incluye el código de país. El botón "Comprar" abrirá WhatsApp con este número.
          </p>
        </div>
        <div>
          <label className="block text-sm mb-1.5 text-ink-soft">
            Dirección
          </label>
          <input
            value={form.contact_address}
            onChange={(e) =>
              setForm({ ...form, contact_address: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl bg-bg shadow-neu-inset outline-none focus:ring-2 focus:ring-accent text-sm"
            placeholder="Tu ciudad, país"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      {success && (
        <p className="text-sm text-green-700 mb-3">Cambios guardados.</p>
      )}

      <button
        disabled={loading}
        className="px-6 py-2.5 rounded-full bg-ink text-bg text-sm shadow-neu-sm disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
