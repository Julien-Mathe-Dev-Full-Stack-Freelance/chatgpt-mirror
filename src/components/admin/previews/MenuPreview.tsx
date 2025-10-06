"use client";

/**
 * @file src/components/admin/previews/MenuPreview.tsx
 * @intro Aperçu inline du menu (items + URLs)
 * @description
 * Rendu simplifié des éléments de menu admin : libellé en gras et URL mutée.
 * Sans navigation interactive ; utile pour prévisualiser l’ordre et les destinations.
 *
 * Accessibilité : nav avec `aria-label`, liens neutralisés côté preview.
 * Observabilité : aucune (composant purement visuel).
 *
 * @layer ui/previews
 */

import { PreviewPanel } from "@/components/admin/molecules/panels/PreviewPanel";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { cn } from "@/lib/cn";
import { toStableKey } from "@/lib/guards";

type MenuItemLikeProps = Readonly<{
  label: string;
  href: string;
  newTab?: boolean;
}>;
type MenuLikeProps = Readonly<{
  items?: ReadonlyArray<MenuItemLikeProps> | null;
}>;

function MenuInlinePreview({ settings }: { settings: MenuLikeProps }) {
  const { t } = useI18n();
  const items = settings.items ?? [];

  return (
    <nav aria-label={t("ui.preview.menu.ariaLabel")}>
      <ul className="flex flex-wrap gap-x-4 gap-y-3 text-sm">
        {items.length > 0 ? (
          items.map((it, i) => (
            <li
              key={toStableKey([it.label, it.href], i)}
              className="inline-flex max-w-xs flex-col gap-1"
            >
              <span className="font-medium text-foreground">{it.label}</span>
              <span className={cn("break-all text-xs", ATOM.textMuted)}>
                {it.href}
                {it.newTab
                  ? ` · ${t("admin.ui.preview.menu.newTab") || "Nouvel onglet"}`
                  : ""}
              </span>
            </li>
          ))
        ) : (
          <li className="opacity-60">{t("admin.menu.preview.empty")}</li>
        )}
      </ul>
    </nav>
  );
}

export function MenuPreview({ settings }: { settings: MenuLikeProps }) {
  const { t } = useI18n();
  return (
    <PreviewPanel label={t("admin.menu.preview.label") || "Menu preview"}>
      <MenuInlinePreview settings={settings} />
    </PreviewPanel>
  );
}
MenuInlinePreview.displayName = "MenuInlinePreview";
MenuPreview.displayName = "MenuPreview";
