"use client";

/**
 * @file src/components/admin/theme/PaletteSelect.tsx
 * @intro Sélecteur de palette (neutral / ocean / violet / forest)
 * @description
 * Composant admin minimal pour changer la palette UI stockée côté client
 * (localStorage) via le hook `usePalette`. Aucune persistance serveur.
 *
 * Accessibilité :
 * - Le trigger expose un `aria-label` explicite.
 *
 * @layer ui/theme
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Palette } from "@/hooks/admin/site/theme/usePalette";
import { usePalette } from "@/hooks/admin/site/theme/usePalette";
import { type Translator, useI18n } from "@/i18n/context";
import { Paintbrush } from "lucide-react";

/** Libellés i18n des palettes. */
const paletteLabel = (t: Translator, p: Palette) =>
  ({
    neutral: t("ui.theme.palette.neutral") || "Neutral",
    ocean: t("ui.theme.palette.ocean") || "Ocean",
    violet: t("ui.theme.palette.violet") || "Violet",
    forest: t("ui.theme.palette.forest") || "Forest",
  }[p]);

/**
 * Sélecteur de palette pour l’interface d’administration.
 * @returns Un contrôleur visuel permettant de choisir la palette active.
 */
export function PaletteSelect() {
  const { t } = useI18n();
  const { palette, setPalette, palettes } = usePalette();

  return (
    <div className="inline-flex items-center gap-2">
      <Paintbrush className="size-4 opacity-70" aria-hidden="true" />
      <Select value={palette} onValueChange={(v) => setPalette(v as Palette)}>
        <SelectTrigger
          className="h-8 w-[160px]"
          aria-label={t("ui.theme.palette.ariaLabel") || "Palette de couleurs"}
        >
          <SelectValue
            placeholder={t("ui.theme.palette.placeholder") || "Palette"}
          />
        </SelectTrigger>
        <SelectContent>
          {palettes.map((p) => (
            <SelectItem key={p} value={p}>
              {paletteLabel(t, p)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
