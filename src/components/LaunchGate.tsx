"use client";

import { ReactNode } from "react";
import ComingSoon from "./ComingSoon";

const LAUNCH_DATE = new Date("2026-02-14T00:00:00-04:00"); // Bolivia timezone (GMT-4)

export default function LaunchGate({ children }: { children: ReactNode }) {
  const now = new Date();
  const isLaunched = now >= LAUNCH_DATE;

  // Allow access during development
  const isDevelopment = process.env.NODE_ENV === "development";

  if (isDevelopment || isLaunched) {
    return <>{children}</>;
  }

  return <ComingSoon />;
}
