"use client";
/**
 * @file src/components/admin/organisms/forms/PrimaryMenuForm.tsx
 * @intro Formulaire menu principal — parents + enfants, patches routés au hook
 * @layer ui/organisms
 * @remarks
 * - **UI only** : types issus du schéma (…Input), aucune dépendance domaine/DTO.
 * - Câblage des flags `invalid` + callbacks `onBlur` vers MenuFieldsItem (parent & enfants).
 */

import { ActionsBar } from "@/components/admin/molecules/ActionsBar";
import { EmptyHint } from "@/components/admin/molecules/EmptyHint";
import { MenuFieldsItem } from "@/components/admin/molecules/MenuFieldsItem";
import { FieldPanel } from "@/components/admin/molecules/panels/FieldPanel";
import { MenuFieldsItemSkeleton } from "@/components/admin/molecules/skeletons/MenuFieldsItemSkeleton";
import { Button } from "@/components/ui/button";
import { ADMIN_SKELETON_COUNTS } from "@/constants/admin/presets";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import type {
  PrimaryMenuItemChildInput,
  PrimaryMenuItemInput,
} from "@/schemas/site/primary-menu/primary-menu";
import { Plus } from "lucide-react";

type PrimaryMenuFormProps = {
  items: ReadonlyArray<PrimaryMenuItemInput>;
  loading?: boolean;
  saving?: boolean;
  isDirty?: boolean;

  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<PrimaryMenuItemInput>) => void;
  onRemove: (index: number) => void;
  onMove: (from: number, to: number) => void;

  // enfants
  onAddChild: (parentIndex: number) => void;
  onUpdateChild: (
    parentIndex: number,
    childIndex: number,
    patch: Partial<PrimaryMenuItemChildInput>
  ) => void;
  onRemoveChild: (parentIndex: number, childIndex: number) => void;
  onMoveChild: (
    parentIndex: number,
    fromIndex: number,
    toIndex: number
  ) => void;

  onReset: () => void;
  onSubmit: () => void;

  /**
   * Flags d’invalidité au niveau **parents** (par index).
   * Chaque entrée: { label?: boolean; href?: boolean }.
   */
  invalidParents?: ReadonlyArray<Partial<Record<"label" | "href", boolean>>>;
  /**
   * Flags d’invalidité au niveau **enfants** :
   * tableau 2D indexé [parentIndex][childIndex] -> { label?: boolean; href?: boolean }.
   */
  invalidChildren?: ReadonlyArray<
    ReadonlyArray<Partial<Record<"label" | "href", boolean>>>
  >;

  /** Blur: parent label/href */
  onParentLabelBlur?: (parentIndex: number) => void;
  onParentHrefBlur?: (parentIndex: number) => void;

  /** Blur: child label/href */
  onChildLabelBlur?: (parentIndex: number, childIndex: number) => void;
  onChildHrefBlur?: (parentIndex: number, childIndex: number) => void;

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
  onAddChild,
  onUpdateChild,
  onRemoveChild,
  onMoveChild,
  onReset,
  onSubmit,
  invalidParents,
  invalidChildren,
  onParentLabelBlur,
  onParentHrefBlur,
  onChildLabelBlur,
  onChildHrefBlur,
  idPrefix = "pm",
  skeletonCount = ADMIN_SKELETON_COUNTS.primaryMenu,
}: PrimaryMenuFormProps) {
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
          items.map((item, pIdx) => {
            const key = `pm-${pIdx}`;
            const isFirst = pIdx === 0;
            const isLast = pIdx === items.length - 1;

            const parentInvalid = invalidParents?.[pIdx];

            return (
              <FieldPanel key={key}>
                {/* Ligne parent */}
                <MenuFieldsItem<PrimaryMenuItemInput>
                  idPrefix={idPrefix}
                  index={pIdx}
                  item={item}
                  isFirst={isFirst}
                  isLast={isLast}
                  disabled={disabled}
                  onPatch={(patch) => onUpdate(pIdx, patch)}
                  onRemove={() => onRemove(pIdx)}
                  onMoveUp={() => onMove(pIdx, Math.max(0, pIdx - 1))}
                  onMoveDown={() =>
                    onMove(pIdx, Math.min(items.length - 1, pIdx + 1))
                  }
                  invalid={parentInvalid}
                  onLabelBlur={() => onParentLabelBlur?.(pIdx)}
                  onHrefBlur={() => onParentHrefBlur?.(pIdx)}
                />

                {/* Enfants */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {t("admin.menu.primary.children")}
                    </p>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onAddChild(pIdx)}
                      disabled={disabled}
                      className="gap-2"
                      type="button"
                    >
                      <Plus className="size-4" />
                      {t("admin.menu.actions.addChild")}
                    </Button>
                  </div>

                  {(item.children ?? []).length === 0 ? (
                    <EmptyHint text={t("admin.menu.children.empty")} />
                  ) : (
                    <ul className="space-y-3">
                      {(item.children ?? []).map((child, cIdx) => {
                        const childInvalid = invalidChildren?.[pIdx]?.[cIdx];

                        return (
                          <li
                            key={`pm-child-${pIdx}-${cIdx}`}
                            className="rounded-lg border p-3"
                          >
                            <MenuFieldsItem<PrimaryMenuItemChildInput>
                              idPrefix={`${idPrefix}-c-${pIdx}`}
                              index={cIdx}
                              item={child}
                              isFirst={cIdx === 0}
                              isLast={cIdx === (item.children?.length ?? 1) - 1}
                              disabled={disabled}
                              onPatch={(patch) =>
                                onUpdateChild(pIdx, cIdx, patch)
                              }
                              onRemove={() => onRemoveChild(pIdx, cIdx)}
                              onMoveUp={() =>
                                onMoveChild(pIdx, cIdx, Math.max(0, cIdx - 1))
                              }
                              onMoveDown={() =>
                                onMoveChild(
                                  pIdx,
                                  cIdx,
                                  Math.min(
                                    (item.children?.length ?? 1) - 1,
                                    cIdx + 1
                                  )
                                )
                              }
                              invalid={childInvalid}
                              onLabelBlur={() => onChildLabelBlur?.(pIdx, cIdx)}
                              onHrefBlur={() => onChildHrefBlur?.(pIdx, cIdx)}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
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
      />
    </form>
  );
}
