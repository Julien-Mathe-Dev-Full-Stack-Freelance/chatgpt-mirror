"use client";

/**
 * @file src/components/admin/molecules/MenuFieldsItem.tsx
 * @intro Ligne éditable d’un item de menu
 * @description Label + Lien + Nouvel onglet + actions Monter/Descendre/Supprimer.
 * Observabilité : Aucune (présentation/contrôlé par props).
 * @layer ui/molecules
 */

import { InputField } from "@/components/admin/molecules/fields/InputField";
import { SwitchField } from "@/components/admin/molecules/fields/SwitchField";
import { Button } from "@/components/ui/button";
import type { PrimaryMenuItemDTO } from "@/core/domain/site/dto";
import { brandHrefSafe } from "@/core/domain/urls/href";
import { useI18n } from "@/i18n/context";

export type MenuFieldsItemProps = {
  idPrefix: string;
  index: number;
  item: PrimaryMenuItemDTO;

  onChange: (patch: Partial<PrimaryMenuItemDTO>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;

  isFirst?: boolean;
  isLast?: boolean;
  disabled?: boolean;
};

export function MenuFieldsItem({
  idPrefix,
  index,
  item,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  disabled = false,
}: MenuFieldsItemProps) {
  const { t } = useI18n();
  const baseId = `${idPrefix}-${index}`;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <InputField
          id={`${baseId}-label`}
          label={t("ui.menu.label")}
          value={item.label}
          onChange={(v) => onChange({ label: v })}
          placeholder={t("ui.menu.label.placeholder")}
          disabled={disabled}
        />

        <InputField
          id={`${baseId}-href`}
          label={t("ui.menu.link")}
          value={item.href}
          onChange={(v) => onChange({ href: brandHrefSafe(v) })}
          placeholder={t("ui.menu.link.placeholder")}
          disabled={disabled}
        />

        <div className="flex w-full flex-col">
          <SwitchField
            id={`${baseId}-newtab`}
            label={t("ui.menu.newTab")}
            help={t("ui.menu.newTab.help")}
            checked={item.newTab}
            onCheckedChange={(v) => onChange({ newTab: v })}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onMoveUp}
            disabled={disabled || isFirst}
            aria-label={t("ui.menu.moveUp.aria")}
            title={t("ui.menu.moveUp")}
          >
            {t("ui.menu.moveUp")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onMoveDown}
            disabled={disabled || isLast}
            aria-label={t("ui.menu.moveDown.aria")}
            title={t("ui.menu.moveDown")}
          >
            {t("ui.menu.moveDown")}
          </Button>
        </div>
        <Button
          type="button"
          variant="destructive"
          onClick={onRemove}
          disabled={disabled}
          aria-label={t("ui.menu.delete.aria")}
          title={t("ui.menu.delete")}
        >
          {t("ui.menu.delete")}
        </Button>
      </div>
    </div>
  );
}
