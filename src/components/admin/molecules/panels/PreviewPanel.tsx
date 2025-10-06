"use client";

/**
 * @file src/components/admin/molecules/panels/PreviewPanel.tsx
 * @intro Panel d’aperçu (libellé + cadre + toggle)
 * @description
 * Affiche un en-tête “Aperçu” avec un interrupteur pour (dé)plier une zone encadrée.
 * Contrôlé (`show` + `onShowChange`) ou non contrôlé (ouvert par défaut).
 *
 * Accessibilité :
 * - `role="region"` + `aria-labelledby` pour lier la zone au libellé.
 * - Switch associé via `htmlFor`/`id` et `aria-controls`.
 *
 * Observabilité : Aucune (présentation pure).
 *
 * @layer ui/molecules
 */

import { PublicThemeScope } from "@/components/shared/theme/PublicThemeScope";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { ThemeSettingsDTO } from "@/core/domain/site/dto";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { PANELS } from "@/infrastructure/ui/patterns";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";
import { useCallback, useId, useMemo, useState } from "react";

type PreviewPanelProps = {
  children: ReactNode;
  show?: boolean;
  onShowChange?: (next: boolean) => void;

  /** Mode non-contrôlé : état par défaut (défaut: true). */
  defaultOpen?: boolean;
  /** Libellé du panneau (défaut: messages « Aperçu »). */
  label?: string;

  /** Thème public à appliquer à l’aperçu (optionnel). */
  theme?: ThemeSettingsDTO;
  /** Classes additionnelles sur le scope thème (si `theme` renseigné). */
  themeClassName?: string;
};

export function PreviewPanel({
  children,
  show,
  onShowChange,
  defaultOpen = true,
  label,
  theme,
  themeClassName,
}: PreviewPanelProps) {
  const { t } = useI18n();
  const isControlled = typeof show === "boolean";
  const [openUncontrolled, setOpenUncontrolled] = useState(defaultOpen);
  const open = isControlled ? (show as boolean) : openUncontrolled;

  const titleId = useId();
  const regionId = useId();
  const switchId = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setOpenUncontrolled(next);
      onShowChange?.(next);
    },
    [isControlled, onShowChange]
  );

  const switchAria = useMemo(
    () => ({ id: switchId, "aria-controls": regionId }),
    [switchId, regionId]
  );

  const titleText = label ?? t("ui.preview.title");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p id={titleId} className={cn("text-sm", ATOM.textMuted)}>
          {titleText}
        </p>

        <div className="flex items-center gap-2">
          <Label htmlFor={switchId} className={cn("text-xs", ATOM.textMuted)}>
            {t("admin.menu.preview.toggle")}
          </Label>
          <Switch {...switchAria} checked={open} onCheckedChange={setOpen} />
        </div>
      </div>

      {open && (
        <div
          id={regionId}
          className={PANELS.previewFrame}
          role="region"
          aria-labelledby={titleId}
        >
          {theme ? (
            <PublicThemeScope theme={theme} className={themeClassName}>
              {children}
            </PublicThemeScope>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
}

PreviewPanel.displayName = "PreviewPanel";
