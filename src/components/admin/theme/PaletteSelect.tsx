"use client";

/**
 * @file src/components/admin/theme/PaletteSelect.tsx
 * @intro Sélecteur de palette (neutral / ocean / violet / forest)
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePalette } from "@/hooks/admin/site/theme/usePalette";
import { useI18n } from "@/i18n/context";
import {
  makePaletteOptions,
  type AdminPaletteId,
} from "@/i18n/factories/admin/theme";

export function PaletteSelect() {
  const { t } = useI18n();
  const { palette, setPalette } = usePalette();
  const options = makePaletteOptions(t);

  return (
    <div className="inline-flex items-center gap-2">
      <Select
        value={palette}
        onValueChange={(v) => setPalette(v as AdminPaletteId)}
      >
        <SelectTrigger
          className="h-8 w-[160px]"
          aria-label={
            t("admin.theme.palette.ariaLabel") || "Palette de couleurs"
          }
        >
          <SelectValue
            placeholder={t("admin.theme.palette.placeholder") || "Palette"}
          />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
