import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CatalogSwiper from "@/components/CatalogSwiper";
import { createClient } from "@/lib/supabaseServer";
import type { Category, Product } from "@/types";

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

  return (
    <main>
      <Navbar />
      <Hero />
      <CatalogSwiper
        categories={(categories as Category[]) ?? []}
        products={(products as Product[]) ?? []}
      />
      <footer className="max-w-6xl mx-auto px-6 py-10 text-sm text-ink-soft flex items-center justify-between">
        <span>© {new Date().getFullYear()} SUR</span>
        <a href="/admin/login" className="hover:text-ink transition-colors">
          Panel admin
        </a>
      </footer>
    </main>
  );
}
