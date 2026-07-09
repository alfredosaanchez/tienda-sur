import { createBrowserClient } from "@supabase/ssr";

// Este cliente se usa en componentes que corren en el navegador
// (por ejemplo el formulario de login o el panel admin)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
