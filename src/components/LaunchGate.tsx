"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ComingSoon from "./ComingSoon";

const LAUNCH_DATE = new Date("2026-02-14T00:00:00-04:00"); // Bolivia timezone (GMT-4)

// Routes that should bypass the launch gate
const ALLOWED_ROUTES = ["/acceso-temprano"];

export default function LaunchGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [hasEarlyAccess, setHasEarlyAccess] = useState<boolean | null>(null);
  const now = new Date();
  const isLaunched = now >= LAUNCH_DATE;

  // Allow access during development
  const isDevelopment = process.env.NODE_ENV === "development";

  // Check if current route is allowed
  const isAllowedRoute = ALLOWED_ROUTES.some(route => pathname.startsWith(route));

  useEffect(() => {
    async function checkEarlyAccess() {
      const supabase = createClient();

      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setHasEarlyAccess(false);
        return;
      }

      // Check if user has redeemed an early access code
      const { data: redemption } = await supabase
        .from("code_redemptions")
        .select("id")
        .eq("user_id", user.id)
        .single();

      setHasEarlyAccess(!!redemption);
    }

    checkEarlyAccess();
  }, []);

  // Show loading state while checking
  if (hasEarlyAccess === null) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>;
  }

  // Allow access if:
  // - Development mode
  // - Launched
  // - Allowed route
  // - User has early access (redeemed a code)
  if (isDevelopment || isLaunched || isAllowedRoute || hasEarlyAccess) {
    return <>{children}</>;
  }

  return <ComingSoon />;
}
