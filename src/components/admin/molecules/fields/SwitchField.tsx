"use client";

import { SwitchFieldSkeleton } from "@/components/admin/molecules/fields/skeletons/SwitchFieldSkeleton";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { cn } from "@/lib/cn";

type SwitchFieldProps = {
  id: string;
  label: string;
  help?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
};

export function SwitchField({
  id,
  label,
  help,
  checked,
  onCheckedChange,
  disabled,
  loading,
}: SwitchFieldProps) {
  const { t } = useI18n();
  const helpId = help ? `${id}-help` : undefined;

  return (
    <div
      className="flex items-center justify-between"
      aria-busy={loading || undefined}
    >
      {loading && (
        <span role="status" aria-live="polite" className={ATOM.srOnly}>
          {t("admin.actions.loading")}
        </span>
      )}

      {loading ? (
        <SwitchFieldSkeleton help={Boolean(help)} />
      ) : (
        <>
          <div className="space-y-1">
            <Label htmlFor={id}>{label}</Label>
            {help ? (
              <p id={helpId} className={cn("text-xs", ATOM.textMuted)}>
                {help}
              </p>
            ) : null}
          </div>

          <Switch
            id={id}
            checked={checked}
            onCheckedChange={onCheckedChange}
            aria-describedby={helpId}
            disabled={disabled}
          />
        </>
      )}
    </div>
  );
}

SwitchField.displayName = "SwitchField";
