import { createClient } from "@/lib/supabaseServer";
import CategoryManager from "@/components/admin/CategoryManager";
import ProductManager from "@/components/admin/ProductManager";
import SiteContentManager from "@/components/admin/SiteContentManager";
import LogoutButton from "@/components/admin/LogoutButton";
import type { Category, Product, SiteContent } from "@/types";

export const revalidate = 0;

export default async function DashboardPage() {
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

  return (
    <main className="min-h-screen bg-bg px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-display italic text-2xl">SUR</p>
            <p className="text-sm text-ink-soft">Panel administrativo</p>
          </div>
          <LogoutButton />
        </div>

        <SiteContentManager initialContent={siteContent as SiteContent | null} />

        <div className="mb-6">
          <CategoryManager initialCategories={(categories as Category[]) ?? []} />
        </div>

        <ProductManager
          initialProducts={(products as Product[]) ?? []}
          categories={(categories as Category[]) ?? []}
        />
      </div>
    </main>
  );
}
