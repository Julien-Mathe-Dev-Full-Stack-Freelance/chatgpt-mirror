"use client";
/**
 * @file src/components/admin/molecules/MenuFieldsItem.tsx
 * @intro Ligne éditable d’un item de menu + intégration NewLinkFieldsItem
 * @layer ui/molecules
 * @remarks
 * - **UI types only** (href: string).
 * - Pas de validation interne : on relaie `invalid` + `onBlur` vers le parent.
 */

import { InputField } from "@/components/admin/molecules/fields/InputField";
import { NewMenuLinkFieldsItem } from "@/components/admin/molecules/NewMenuLinkFieldsItem";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/context";

type MenuItemLike = Readonly<{
  label: string;
  href: string; // <-- string (pas de brand)
  newTab: boolean;
  isExternal: boolean;
  children?: ReadonlyArray<unknown>;
  id?: string;
}>;

type MenuFieldsItemProps<TItem extends MenuItemLike = MenuItemLike> = Readonly<{
  idPrefix: string;
  index: number;
  item: TItem;

  onPatch: (patch: Partial<TItem>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;

  /** Flags d’invalidité pour le style (champ label / champ href) */
  invalid?: Partial<Record<"label" | "href", boolean>>;

  /**
   * Blur handlers (pour marquer “touched” et déclencher la validation/hints en tête).
   * - `onLabelBlur` : appelé à la sortie du champ Libellé
   * - `onHrefBlur`  : appelé à la sortie du champ Lien (ou Enter / toggle)
   */
  onLabelBlur?: () => void;
  onHrefBlur?: () => void;

  isFirst?: boolean;
  isLast?: boolean;
  disabled?: boolean;
}>;

export function MenuFieldsItem<TItem extends MenuItemLike>({
  idPrefix,
  index,
  item,
  onPatch,
  onRemove,
  onMoveUp,
  onMoveDown,
  invalid,
  onLabelBlur,
  onHrefBlur,
  isFirst = false,
  isLast = false,
  disabled = false,
}: MenuFieldsItemProps<TItem>) {
  const { t } = useI18n();
  const baseId = `${idPrefix}-${index}`;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        {/* Libellé */}
        <InputField
          id={`${baseId}-label`}
          label={t("admin.menu.label")}
          value={item.label}
          onChange={(v) => onPatch({ label: v } as Partial<TItem>)}
          onBlur={onLabelBlur}
          placeholder={t("admin.menu.placeholder.label")}
          disabled={disabled}
          invalid={invalid?.label}
        />

        {/* Lien + toggles */}
        <NewMenuLinkFieldsItem<TItem>
          id={`${baseId}-href`}
          item={item}
          disabled={disabled}
          onPatch={onPatch}
          onBlurValidate={onHrefBlur}
          invalid={invalid?.href}
        />

        {/* Colonne 3 laissée vide pour stabilité de la grille */}
        <div aria-hidden className="flex w-full flex-col" />
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onMoveUp}
            disabled={disabled || isFirst}
            aria-label={t("admin.menu.actions.moveUp")}
            title={t("admin.menu.actions.moveUp")}
          >
            {t("admin.menu.actions.moveUp")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onMoveDown}
            disabled={disabled || isLast}
            aria-label={t("admin.menu.actions.moveDown")}
            title={t("admin.menu.actions.moveDown")}
          >
            {t("admin.menu.actions.moveDown")}
          </Button>
        </div>
        <Button
          type="button"
          variant="destructive"
          onClick={onRemove}
          disabled={disabled}
          aria-label={t("admin.menu.actions.delete")}
          title={t("admin.menu.actions.delete")}
        >
          {t("admin.menu.actions.delete")}
        </Button>
      </div>
    </div>
  );
}
