"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded-full bg-surface shadow-neu-sm text-sm text-ink-soft hover:text-ink transition-colors"
    >
      Cerrar sesión
    </button>
  );
}
