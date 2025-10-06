// src/app/layout.tsx
/**
 * @file src/app/layout.tsx
 * @intro Shell applicatif Next.js (App Router)
 * @layer app/shell
 */

import "@/app/globals.css";
import { AdminPaletteBoot } from "@/components/admin/theme/AdminPaletteBoot";
import { ThemeProvider } from "@/components/admin/theme/ThemeProvider";
import { ConfirmDialogProvider } from "@/components/shared/confirm/ConfirmDialogProvider";
import { I18nProvider } from "@/i18n/context";
import { resolveRequestLocale } from "@/i18n/server"; // ✅ import
import { cn } from "@/lib/cn";
import { installZodErrorConfig } from "@/schemas/setup-zod";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// Remplace les messages par défaut de Zod par des variantes FR
installZodErrorConfig();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Métadonnées par défaut (surclassables par page). */
export const metadata: Metadata = {
  title: "Compoz Studio",
  description:
    "Mini-studio pour créer et gérer des pages (V1 locale, FileSystem).",
  // @todo (SEO) Ajouter openGraph / twitter / icons si pertinent.
};

/**
 * Racine de l’application (App Router) — enveloppe HTML + providers globaux.
 */
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // ✅ le layout est async → on peut await
  const initialLocale = await resolveRequestLocale();

  return (
    <html lang={initialLocale} suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "antialiased",
          // Thème par défaut : admin ; le layout public peut remplacer par "site-theme"
          "admin-theme"
        )}
      >
        <I18nProvider defaultLocale={initialLocale}>
          <ConfirmDialogProvider>
            <ThemeProvider>
              <AdminPaletteBoot />
              {children}
            </ThemeProvider>
          </ConfirmDialogProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
