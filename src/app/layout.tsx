/**
 * @file src/app/layout.tsx
 * @intro Shell applicatif Next.js (App Router)
 * @description
 * - Monte les polices (Geist) en CSS variables pour Tailwind.
 * - Applique la base a11y (lang) et les classes utilitaires globales.
 * - Laisse la gestion du skip-link et de l’en-tête à l’UI (ex. <AdminHeader />).
 *
 * @layer app/shell
 * @remarks
 * - Les thèmes admin/public sont scopés via les classes `admin-theme` / `site-theme` (voir globals.css).
 *   Ici, le layout racine applique `site-theme`; le layout Admin se charge d’ajouter `admin-theme`.
 * - `suppressHydrationWarning` est activé pour éviter le bruit lors du switch thème côté client.
 * @todo (SEO) Affiner `metadata` (title, description, openGraph) quand le branding sera figé.
 * @todo (thème) Si un mode sombre dynamique global est ajouté, vérifier la classe `dark`.
 */

import "@/app/globals.css";
import { ThemeProvider } from "@/components/admin/theme/ThemeProvider";
import { I18nProvider } from "@/i18n/context";
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
 * @param props.children - Contenu de la page/route (rendu dans <body>).
 * @returns L’arbre HTML racine avec providers (i18n + thème).
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Langue FR (cohérent avec l’UI et l’accessibilité)
    <html lang="fr" suppressHydrationWarning>
      <body
        className={cn(
          "site-theme",
          geistSans.variable,
          geistMono.variable,
          "antialiased"
        )}
      >
        <I18nProvider defaultLocale="fr">
          <ThemeProvider>{children}</ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
