"use client";

/**
 * @file src/components/admin/molecules/ActionsBar.tsx
 * @intro Barre d’actions (boutons alignés à droite)
 * @description Standardise le pied de formulaire (3 variantes) + skeleton.
 * Observabilité : Aucune (présentation pure).
 * Accessibilité : Wrapper stable avec aria-busy + annonce sr-only.
 * @layer ui/molecules
 */

import {
  ActionsBarSkeleton,
  type ActionsBarSkeletonVariant,
} from "@/components/admin/molecules/skeletons/ActionBarSkeleton";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";

type Variant = ActionsBarSkeletonVariant;

type ActionsBarProps = {
  variant?: Variant;
  loading?: boolean;
  saving?: boolean;
  isDirty?: boolean;
  disabled?: boolean;

  onSubmit?: () => void;
  onReset?: () => void;
  onAdd?: () => void;

  submitType?: "submit" | "button";

  submitLabel?: string;
  submitLoadingLabel?: string;
  resetLabel?: string;
  addLabel?: string;

  submitDisabled?: boolean;
  resetDisabled?: boolean;
  addDisabled?: boolean;
};

export function ActionsBar({
  variant = "resetSubmit",
  loading = false,
  saving = false,
  isDirty,
  disabled = false,

  onSubmit,
  onReset,
  onAdd,

  submitType = "submit",

  submitDisabled,
  resetDisabled,
  addDisabled,
}: ActionsBarProps) {
  const { t } = useI18n();
  const baseDisabled = disabled || loading || saving;

  const computedSubmitDisabled =
    submitDisabled ??
    (baseDisabled || (isDirty === undefined ? false : !isDirty));
  const computedResetDisabled =
    resetDisabled ??
    (baseDisabled || (isDirty === undefined ? false : !isDirty));
  const computedAddDisabled = addDisabled ?? baseDisabled;

  const isBusy = loading || saving;

  return (
    <div className="pt-2" aria-busy={isBusy}>
      {isBusy && (
        <span role="status" aria-live="polite" className={ATOM.srOnly}>
          {t("admin.actions.loading")}
        </span>
      )}

      {loading ? (
        <ActionsBarSkeleton variant={variant} withAria={false} />
      ) : variant === "addResetSubmit" ? (
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onAdd}
            disabled={computedAddDisabled}
          >
            {t("admin.actions.add")}
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onReset?.();
              }}
              disabled={computedResetDisabled}
            >
              {t("admin.actions.reset")}
            </Button>
            <Button
              type={submitType}
              onClick={submitType === "button" ? onSubmit : undefined}
              disabled={computedSubmitDisabled}
            >
              {saving ? t("admin.actions.saving") : t("admin.actions.save")}
            </Button>
          </div>
        </div>
      ) : variant === "submitOnly" ? (
        <div className="flex justify-end">
          <Button
            type={submitType}
            onClick={submitType === "button" ? onSubmit : undefined}
            disabled={computedSubmitDisabled}
          >
            {saving ? t("admin.actions.saving") : t("admin.actions.save")}
          </Button>
        </div>
      ) : (
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onReset?.();
            }}
            disabled={computedResetDisabled}
          >
            {t("admin.actions.reset")}
          </Button>
          <Button
            type={submitType}
            onClick={submitType === "button" ? onSubmit : undefined}
            disabled={computedSubmitDisabled}
          >
            {saving ? t("admin.actions.saving") : t("admin.actions.save")}
          </Button>
        </div>
      )}
    </div>
  );
}
