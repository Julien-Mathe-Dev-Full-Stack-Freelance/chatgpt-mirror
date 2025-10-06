"use client";

/**
 * @file src/components/layouts/Header.tsx
 * @intro En-tête persistant de l’admin (UI pure, stateless)
 * @description
 * - Skip-link vers `#main` (a11y clavier).
 * - Branding et zone d’actions simples.
 *
 * Observabilité : Aucune (présentation pure).
 *
 * @layer ui/components
 * @remarks
 * - Largeur alignée : `max-w-screen-xl`.
 * - Pas de `className` en props (surcharge interdite côté admin).
 * - Le skip-link suppose un `<main id="main">` dans le layout.
 */

import { PaletteSelect } from "@/components/admin/theme/PaletteSelect";
import { ThemeToggle } from "@/components/admin/theme/ThemeToggle"; // ← orthographe ok
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { CONTAINER_CLASS } from "@/infrastructure/ui/container";
import { LAYOUTS, SKIP_LINK } from "@/infrastructure/ui/patterns";
import { cn } from "@/lib/cn";

/**
 * Composant Header (admin).
 * @returns En-tête persistant de l’interface d’administration.
 */
export function Header() {
  const { t } = useI18n();
  return (
    <header
      // <header> a déjà le landmark implicite “banner” → pas besoin de role="banner"
      aria-label={t("admin.header.ariaHeader")}
      className={LAYOUTS.header}
    >
      {/* Skip link : premier focus clavier pour accéder au contenu */}
      <a
        href="#main"
        className={cn(ATOM.srOnly, SKIP_LINK.base, SKIP_LINK.focus)}
      >
        {t("admin.header.skipToContent")}
      </a>

      {/* Conteneur aligné avec le layout admin */}
      <div className={cn(CONTAINER_CLASS.normal, LAYOUTS.headerInner)}>
        <p className="text-2xl font-semibold tracking-tight">
          {t("admin.header.brand")}
        </p>

        {/* Zone d’actions standard (statique pour l’instant) */}
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" disabled>
            {t("admin.header.comingSoon")}
          </Button>
          <PaletteSelect />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
