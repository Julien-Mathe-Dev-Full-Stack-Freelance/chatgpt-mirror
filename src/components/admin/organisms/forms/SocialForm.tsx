"use client";

import { ActionsBar } from "@/components/admin/molecules/ActionsBar";
import { EmptyHint } from "@/components/admin/molecules/EmptyHint";
import { SocialFieldsItem } from "@/components/admin/molecules/SocialFieldsItem";
import { FieldPanel } from "@/components/admin/molecules/panels/FieldPanel";
import { SocialFieldsItemSkeleton } from "@/components/admin/molecules/skeletons/SocialFieldsItemSkeleton";
import { ADMIN_SKELETON_COUNTS } from "@/constants/admin/presets";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { hasStringId } from "@/lib/guards";
import type { SocialItemInput } from "@/schemas/site/social/social";

type SocialFormProps = {
  items: ReadonlyArray<SocialItemInput>;
  loading?: boolean;
  saving?: boolean;
  isDirty?: boolean;

  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<SocialItemInput>) => void;
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
            <SocialFieldsItemSkeleton key={i} />
          ))
        ) : items.length === 0 ? (
          <EmptyHint text={t("admin.social.empty")} />
        ) : (
          items.map((item, index) => {
            // clé stable pour éviter les remounts pendant la frappe
            const key = hasStringId(item) ? item.id : `${idPrefix}-${index}`;

            return (
              <FieldPanel key={key}>
                <SocialFieldsItem
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
        addLabel={t("admin.social.actions.add")}
      />
    </form>
  );
}
