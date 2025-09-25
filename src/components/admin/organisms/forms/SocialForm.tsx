"use client";

import { ActionsBar } from "@/components/admin/molecules/ActionsBar";
import { EmptyHint } from "@/components/admin/molecules/EmptyHint";
import { SocialFieldsItem } from "@/components/admin/molecules/SocialFieldsItem";
import { FieldPanel } from "@/components/admin/molecules/panels/FieldPanel";
import { SocialFieldsItemSkeleton } from "@/components/admin/molecules/skeletons/SocialFieldsItemSkeleton";
import { ADMIN_SKELETON_COUNTS } from "@/constants/admin/presets";
import type { SocialItemDTO } from "@/core/domain/site/dto";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { hasStringId } from "@/lib/guards";

export type SocialFormProps = {
  items: ReadonlyArray<SocialItemDTO>;
  loading?: boolean;
  saving?: boolean;
  isDirty?: boolean;
  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<SocialItemDTO>) => void;
  onRemove: (index: number) => void;
  onMove: (from: number, to: number) => void;
  onReset: () => void;
  onSubmit: () => void;
  idPrefix?: string;
  skeletonCount?: number;
};

export function SocialForm({
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
  idPrefix = "soc",
  skeletonCount = ADMIN_SKELETON_COUNTS.socialList,
}: SocialFormProps) {
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
            <SocialFieldsItemSkeleton key={i} />
          ))
        ) : items.length === 0 ? (
          <EmptyHint text={t("admin.social.ui.empty")} />
        ) : (
          items.map((item, index) => (
            <FieldPanel key={hasStringId(item) ? item.id : index}>
              <SocialFieldsItem
                idPrefix={idPrefix}
                index={index}
                item={item}
                isFirst={index === 0}
                isLast={index === items.length - 1}
                disabled={disabled}
                onChange={(patch) =>
                  onUpdate(index, patch as Partial<SocialItemDTO>)
                }
                onRemove={() => onRemove(index)}
                onMoveUp={() => onMove(index, Math.max(0, index - 1))}
                onMoveDown={() =>
                  onMove(index, Math.min(items.length - 1, index + 1))
                }
              />
            </FieldPanel>
          ))
        )}
      </div>

      <ActionsBar
        variant="addResetSubmit"
        loading={loading}
        saving={saving}
        isDirty={isDirty}
        onAdd={onAdd}
        onReset={onReset}
        addLabel={t("admin.social.ui.add")}
      />
    </form>
  );
}
