"use client";

import { ActionsBar } from "@/components/admin/molecules/ActionsBar";
import { EmptyHint } from "@/components/admin/molecules/EmptyHint";
import { MenuFieldsItem } from "@/components/admin/molecules/MenuFieldsItem";
import { FieldPanel } from "@/components/admin/molecules/panels/FieldPanel";
import { MenuFieldsItemSkeleton } from "@/components/admin/molecules/skeletons/MenuFieldsItemSkeleton";
import { ADMIN_SKELETON_COUNTS } from "@/constants/admin/presets";
import type { LegalMenuItemDTO } from "@/core/domain/site/dto";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { hasStringId } from "@/lib/guards";

export type LegalMenuFormProps = {
  items: ReadonlyArray<LegalMenuItemDTO>;
  loading?: boolean;
  saving?: boolean;
  isDirty?: boolean;
  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<LegalMenuItemDTO>) => void;
  onRemove: (index: number) => void;
  onMove: (from: number, to: number) => void;
  onReset: () => void;
  onSubmit: () => void;
  idPrefix?: string;
  skeletonCount?: number;
};

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
  idPrefix = "lm",
  skeletonCount = ADMIN_SKELETON_COUNTS.legalMenu,
}: LegalMenuFormProps) {
  const { t } = useI18n();
  const disabled = !!(saving || loading);

  return (
    <form
      aria-busy={loading || saving}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      noValidate
      className="space-y-4"
    >
      {(loading || saving) && (
        <span role="status" aria-live="polite" className={ATOM.srOnly}>
          {loading ? t("ui.loading") : t("ui.actions.saving")}
        </span>
      )}

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: skeletonCount }).map((_, i) => (
            <MenuFieldsItemSkeleton key={i} />
          ))
        ) : items.length === 0 ? (
          <EmptyHint text={t("ui.legal.empty")} />
        ) : (
          items.map((item, index) => {
            const key = hasStringId(item)
              ? item.id
              : `${item.label}:${item.href}:${index}`;
            return (
              <FieldPanel key={key}>
                <MenuFieldsItem
                  idPrefix={idPrefix}
                  index={index}
                  item={item}
                  isFirst={index === 0}
                  isLast={index === items.length - 1}
                  disabled={disabled}
                  onChange={(patch) =>
                    onUpdate(index, patch as Partial<LegalMenuItemDTO>)
                  }
                  onRemove={() => onRemove(index)}
                  onMoveUp={() => onMove(index, Math.max(0, index - 1))}
                  onMoveDown={() =>
                    onMove(index, Math.min(items.length - 1, index + 1))
                  }
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
        addLabel={t("ui.legal.add")}
      />
    </form>
  );
}
