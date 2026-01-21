"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";

export default function AuthButton() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user);

      if (user) {
        // Get username from profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("user_id", user.id)
          .single();

        setUsername(profile?.username || null);
      }

      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("user_id", session.user.id)
          .single();

        setUsername(profile?.username || null);
      } else {
        setUsername(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  if (loading) {
    return <div className="w-20 h-9 bg-gray-100 rounded-lg animate-pulse" />;
  }

  if (user) {
    const displayName = username || user.email?.split("@")[0];

    return (
      <div className="flex items-center gap-3">
        <Link
          href="/perfil"
          className="text-sm text-gray-600 hover:text-purple-600 hidden sm:block"
        >
          {displayName}
        </Link>
        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          Salir
        </button>
      </div>
    );
  }

  return (
    <a
      href="/login"
      className="text-gray-600 hover:text-purple-600 font-medium"
    >
      Iniciar Sesión
    </a>
  );
}
