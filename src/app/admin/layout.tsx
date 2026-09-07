import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { AdminProviders } from "./providers";
import "../globals.css";

// This is its own root layout (no layout.tsx above /admin), separate from
// the public site's [lang]/layout.tsx — the backoffice is deliberately
// outside the customer-facing locale tree. See ROADMAP.md Phase 1.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ZambiTour — Backoffice",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt">
      <body className={`${inter.variable} font-sans bg-slate-50 text-slate-900`}>
        <AdminProviders>{children}</AdminProviders>
      </body>
    </html>
  );
}
