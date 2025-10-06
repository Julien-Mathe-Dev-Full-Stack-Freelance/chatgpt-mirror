"use client";

/**
 * @file src/components/admin/molecules/MenuBadges.tsx
 * @intro Badges (type + icône) pour items de menu (groupe, externe, interne)
 * @layer ui/molecules
 * @remarks
 * - **UI only** : `href` est une string (aucun brand domaine).
 * - Aucune validation métier ; feedback purement visuel.
 */

import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/cn";
import { ExternalLink, FolderTree, Globe } from "lucide-react";
import type { ReactNode } from "react";

type MenuItemForBadges = Readonly<{
  href: string; // ← string (pas d'AssetUrl ici)
  children?: ReadonlyArray<unknown>;
}>;

type Kind = "group" | "external" | "internal";

function detectKind(href: string, hasChildren: boolean): Kind[] {
  const kinds: Kind[] = [];
  if (hasChildren) kinds.push("group");
  if (/^https?:\/\//i.test(href.trim())) kinds.push("external");
  else kinds.push("internal");
  return kinds;
}

const ICONS: Record<Kind, ReactNode> = {
  group: <FolderTree className="size-3.5" aria-hidden="true" />,
  external: <ExternalLink className="size-3.5" aria-hidden="true" />,
  internal: <Globe className="size-3.5" aria-hidden="true" />,
};

type MenuBadgesProps = Readonly<{
  item: MenuItemForBadges;
  className?: string;
}>;

export function MenuBadges({ item, className }: MenuBadgesProps) {
  const { t } = useI18n();
  const hrefStr = String(item.href ?? "");
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  const kinds = detectKind(hrefStr, hasChildren);
  const label = kinds.map((k) => t(`admin.menu.badges.${k}`)).join(", ");

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-[11px]",
        className
      )}
      aria-label={t("admin.menu.badges.ariaLabel", { type: label })}
    >
      {kinds.map((k, i) => (
        <Badge
          key={`${k}-${i}`}
          variant="secondary"
          className="gap-1 px-1.5 py-0.5"
        >
          <span>{ICONS[k]}</span>
          <span className="leading-none">{t(`admin.menu.badges.${k}`)}</span>
        </Badge>
      ))}
    </div>
  );
}
