"use client";

import { ActionsBar } from "@/components/admin/molecules/ActionsBar";
import { EmptyHint } from "@/components/admin/molecules/EmptyHint";
import { MenuFieldsItem } from "@/components/admin/molecules/MenuFieldsItem";
import { FieldPanel } from "@/components/admin/molecules/panels/FieldPanel";
import { MenuFieldsItemSkeleton } from "@/components/admin/molecules/skeletons/MenuFieldsItemSkeleton";
import { useI18n } from "@/i18n/context";
import type { PrimaryMenuItemDTO } from "@/core/domain/site/dto";
import { ATOM } from "@/infrastructure/ui/atoms";
import { ADMIN_SKELETON_COUNTS } from "@/constants/admin/presets";
import { hasStringId } from "@/lib/guards";

export type PrimaryMenuFormProps = {
  items: ReadonlyArray<PrimaryMenuItemDTO>;
  loading?: boolean;
  saving?: boolean;
  isDirty?: boolean;
  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<PrimaryMenuItemDTO>) => void;
  onRemove: (index: number) => void;
  onMove: (from: number, to: number) => void;
  onReset: () => void;
  onSubmit: () => void;
  idPrefix?: string;
  skeletonCount?: number;
};

export function PrimaryMenuForm({
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
  idPrefix = "pm",
  skeletonCount = ADMIN_SKELETON_COUNTS.primaryMenu,
}: PrimaryMenuFormProps) {
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
          <EmptyHint text={t("ui.menu.empty")} />
        ) : (
          items.map((item, index) => {
            const key = hasStringId(item)
              ? item.id
              : `primary-menu-item-${index}`;
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
                    onUpdate(index, patch as Partial<PrimaryMenuItemDTO>)
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
        addLabel={t("ui.menu.add")}
      />
    </form>
  );
}
