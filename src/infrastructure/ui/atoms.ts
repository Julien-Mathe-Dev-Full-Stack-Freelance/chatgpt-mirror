/**
 * @file src/infrastructure/ui/atoms.ts
 * @intro Atomes d'UI (classes utilitaires : typo, grids, radius, spacing)
 * @layer infra/ui
 */
export const ATOM = {
  srOnly: "sr-only",
  textMuted: "text-muted-foreground",
  radius: {
    panel: "rounded-xl",
    button: "rounded-md",
  },
  space: {
    panelPadding: "p-4",
    sectionGap: "space-y-4",
    tabsGap: "space-y-6",
    pageGap: "space-y-8",
  },
  border: {
    panel: "border",
  },
} as const;

export const HEADINGS = {
  h1: "text-3xl md:text-4xl font-semibold tracking-tight",
  h2: "text-base font-semibold tracking-tight",
  h3: "text-sm font-medium tracking-tight",
  h4: "text-sm font-medium",
  h5: "text-xs font-medium",
  h6: "text-xs",
} as const;

export const GRIDS = {
  form2: "grid gap-5 sm:grid-cols-2",
} as const;
