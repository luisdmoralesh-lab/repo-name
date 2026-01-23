"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import ComingSoon from "./ComingSoon";

const LAUNCH_DATE = new Date("2026-02-14T00:00:00-04:00"); // Bolivia timezone (GMT-4)

// Routes that should bypass the launch gate
const ALLOWED_ROUTES = ["/acceso-temprano"];

export default function LaunchGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const now = new Date();
  const isLaunched = now >= LAUNCH_DATE;

  // Allow access during development
  const isDevelopment = process.env.NODE_ENV === "development";

  // Check if current route is allowed
  const isAllowedRoute = ALLOWED_ROUTES.some(route => pathname.startsWith(route));

  if (isDevelopment || isLaunched || isAllowedRoute) {
    return <>{children}</>;
  }

  return <ComingSoon />;
}
