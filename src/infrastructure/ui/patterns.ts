/**
 * @file src/infrastructure/ui/patterns.ts
 * @intro Patterns UI (card/panel, header, skip link)
 * @layer infra/ui
 */
// src/infrastructure/ui/patterns.ts
import { clsx } from "clsx";
import { ATOM } from "./atoms";

/** Base commune pour les panneaux (radius + border + padding canonique) */
const PANEL_BASE = clsx(
  ATOM.radius.panel,
  ATOM.border.panel,
  ATOM.space.panelPadding
);

/** Patterns UI (card/panel, header, skip link) */
export const CARD_BOX = {
  root: ATOM.radius.panel,
  header: clsx(ATOM.space.panelPadding, "pb-2"),
  content: ATOM.space.panelPadding,
  footer: clsx(ATOM.space.panelPadding, "pt-0"),
} as const;

export const PANELS = {
  field: clsx("h-full", PANEL_BASE, "space-y-2"),
  previewFrame: PANEL_BASE,
} as const;

export const PREVIEW_BLOCKS = {
  spacerSm:
    "h-16 w-full rounded-lg border border-dashed border-muted/40 bg-muted/20",
  spacerLg:
    "h-24 w-full rounded-lg border border-dashed border-muted/40 bg-muted/20",
};

export const LAYOUTS = {
  header:
    "sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur",
  headerInner: "flex h-16 items-center justify-between",
} as const;

export const SKIP_LINK = {
  // Position + sizing + typo neutres (pas de focus styles ici)
  base: "fixed left-2 top-2 z-50 rounded-md px-3 py-2 text-sm font-medium bg-background",

  // Styles appliqués à l’état focus (révèle l’élément + accent visuel)
  focus:
    "focus:not-sr-only focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background focus:bg-accent focus:text-accent-foreground",
} as const;

// (Optionnel) Si tu préfères un helper composable côté UI :
// export const skipLinkClass = clsx(ATOM.srOnly, SKIP_LINK.base, SKIP_LINK.focus);
