/**
 * @file src/app/admin/layout.tsx
 * @intro Layout d’administration
 * @description
 * Définit le “shell” admin : en-tête, zone de contenu principale et pied de page.
 * Gère un conteneur centré de largeur maîtrisée pour toutes les pages `/admin/*`.
 *
 * @layer ui
 * @remarks
 * - Le skip-link est géré dans <AdminHeader /> (premier élément focusable).
 * - Évite d’empiler des conteneurs `mx-auto` dans les pages enfant.
 * - Monte **un seul** <Toaster /> dans l’arbre (de préférence `app/layout.tsx`).
 *   Si un Toaster global existe déjà, supprime celui-ci pour éviter les doublons.
 * - Applique la classe `admin-theme` pour fournir les tokens de style admin.
 */

import { Footer } from "@/components/admin/layouts/Footer";
import { Header } from "@/components/admin/layouts/Header";
import { Toaster } from "@/components/ui/sonner";

/**
 * Shell commun à toutes les routes `/admin/*`.
 * @param props.children - Contenu spécifique à la page admin rendue.
 * @returns JSX.Element — Structure d’interface (header, main, footer) pour l’admin.
 */
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      {/* En-tête (inclut le skip-link pour un focus clavier cohérent) */}
      <Header />

      {/* Zone de contenu (full-bleed) */}
      <main id="main" className="flex-1">
        {/* Conteneur centré + largeur max confortable */}
        <div className="mx-auto w-full max-w-screen-xl space-y-6 px-4 py-8 md:py-10">
          {children}
        </div>
      </main>

      {/* Toaster local à l’admin — supprime-le si tu as déjà un Toaster global */}
      <Toaster />

      {/* Pied de page */}
      <Footer />
    </div>
  );
}
