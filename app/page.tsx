import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CatalogSwiper from "@/components/CatalogSwiper";
import { createClient } from "@/lib/supabaseServer";
import type { Category, Product, SiteContent } from "@/types";

// Vuelve a pedir los datos cada vez que alguien visita la página
// (así los cambios que hagas en el admin aparecen enseguida)
export const revalidate = 0;

export default async function HomePage() {
  const supabase = createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(*)")
    .order("created_at", { ascending: false });

  const { data: siteContent } = await supabase
    .from("site_content")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  const content = siteContent as SiteContent | null;

  return (
    <main>
      <Navbar />
      <Hero siteContent={content} />
      <CatalogSwiper
        categories={(categories as Category[]) ?? []}
        products={(products as Product[]) ?? []}
        contactPhone={content?.contact_phone}
        contactEmail={content?.contact_email}
      />

      {/* Nosotros */}
      <section id="nosotros" className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-sm tracking-[0.2em] uppercase text-accent mb-2">
          {content?.about_title || "Nosotros"}
        </p>
        <p className="text-ink-soft leading-relaxed whitespace-pre-line">
          {content?.about_text ||
            "Contanos aquí la historia de tu marca desde el panel admin."}
        </p>
      </section>

      {/* Contacto */}
      <section id="contacto" className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-sm tracking-[0.2em] uppercase text-accent mb-4">
          Contacto
        </p>
        <div className="bg-surface rounded-xl2 shadow-neu p-6 grid sm:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-ink-soft mb-1">Correo</p>
            <p>{content?.contact_email || "—"}</p>
          </div>
          <div>
            <p className="text-ink-soft mb-1">Teléfono / WhatsApp</p>
            <p>{content?.contact_phone || "—"}</p>
          </div>
          <div>
            <p className="text-ink-soft mb-1">Dirección</p>
            <p>{content?.contact_address || "—"}</p>
          </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-10 text-sm text-ink-soft flex items-center justify-between">
        <span>© {new Date().getFullYear()} ALSE</span>
        <a href="/admin/login" className="hover:text-ink transition-colors">
          Panel admin
        </a>
      </footer>
    </main>
  );
}
