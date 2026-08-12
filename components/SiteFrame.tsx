"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isV2 = pathname === "/v2" || pathname.endsWith("/v2") || pathname.includes("/v2/");

  return (
    <>
      {!isV2 && <a className="skip-link" href="#main">Skip to content</a>}
      {!isV2 && <Navigation />}
      <main id="main">{children}</main>
      {!isV2 && <Footer />}
    </>
  );
}
