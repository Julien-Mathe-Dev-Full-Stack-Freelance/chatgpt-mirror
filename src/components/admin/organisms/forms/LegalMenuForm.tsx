"use client";
/**
 * @file src/components/admin/organisms/forms/LegalMenuForm.tsx
 * @intro Formulaire menu légal — simple route des patches vers la Section
 * @layer ui/organisms
 */

import { ActionsBar } from "@/components/admin/molecules/ActionsBar";
import { EmptyHint } from "@/components/admin/molecules/EmptyHint";
import { MenuFieldsItem } from "@/components/admin/molecules/MenuFieldsItem";
import { FieldPanel } from "@/components/admin/molecules/panels/FieldPanel";
import { MenuFieldsItemSkeleton } from "@/components/admin/molecules/skeletons/MenuFieldsItemSkeleton";
import { ADMIN_SKELETON_COUNTS } from "@/constants/admin/presets";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { hasStringId } from "@/lib/guards";
import type { LegalMenuItemInput } from "@/schemas/site/legal-menu/legal-menu";

type LegalMenuFormProps = Readonly<{
  items: ReadonlyArray<LegalMenuItemInput>;
  loading?: boolean;
  saving?: boolean;
  isDirty?: boolean;

  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<LegalMenuItemInput>) => void;
  onRemove: (index: number) => void;
  onMove: (from: number, to: number) => void;

  onReset: () => void;
  onSubmit: () => void;

  invalid?: ReadonlyArray<Partial<Record<"label" | "href", boolean>>>;
  onLabelBlur?: (index: number) => void;
  onHrefBlur?: (index: number) => void;

  idPrefix?: string;
  skeletonCount?: number;
}>;

export function LegalMenuForm({
  items,
  loading,
  saving,
  isDirty,
  onAdd,
  onUpdate,
  onRemove,
  onMove,
  onReset,
  onSubmit,
  invalid,
  onLabelBlur,
  onHrefBlur,
  idPrefix = "lm",
  skeletonCount = ADMIN_SKELETON_COUNTS.legalMenu,
}: LegalMenuFormProps) {
  const { t } = useI18n();
  const disabled = !!(saving || loading);

  return (
    <form
      aria-busy={loading || saving || undefined}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      noValidate
      className="space-y-4"
    >
      {(loading || saving) && (
        <span role="status" aria-live="polite" className={ATOM.srOnly}>
          {loading ? t("admin.actions.loading") : t("admin.actions.saving")}
        </span>
      )}

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: skeletonCount }).map((_, i) => (
            <MenuFieldsItemSkeleton key={i} />
          ))
        ) : items.length === 0 ? (
          <EmptyHint text={t("admin.menu.empty")} />
        ) : (
          items.map((item, index) => {
            // 🔒 Clé stable pour éviter les remounts pendant la frappe
            const key = hasStringId(item) ? item.id : `${idPrefix}-${index}`;

            const invalidEntry = invalid?.[index];

            return (
              <FieldPanel key={key}>
                <MenuFieldsItem<LegalMenuItemInput>
                  idPrefix={idPrefix}
                  index={index}
                  item={item}
                  isFirst={index === 0}
                  isLast={index === items.length - 1}
                  disabled={disabled}
                  onPatch={(patch) => onUpdate(index, patch)}
                  onRemove={() => onRemove(index)}
                  onMoveUp={() => onMove(index, Math.max(0, index - 1))}
                  onMoveDown={() =>
                    onMove(index, Math.min(items.length - 1, index + 1))
                  }
                  invalid={invalidEntry}
                  onLabelBlur={() => onLabelBlur?.(index)}
                  onHrefBlur={() => onHrefBlur?.(index)}
                />
              </FieldPanel>
            );
          })
        )}
      </div>

      <ActionsBar
        variant="addResetSubmit"
        loading={loading}
        saving={saving}
        isDirty={isDirty}
        onAdd={onAdd}
        onReset={onReset}
        addLabel={t("admin.actions.add")}
      />
    </form>
  );
}
