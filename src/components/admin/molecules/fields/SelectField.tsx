"use client";

import { SelectFieldSkeleton } from "@/components/admin/molecules/fields/skeletons/SelectFieldSkeleton";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { cn } from "@/lib/cn";

type SelectOption = { value: string; label: string };

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  items: ReadonlyArray<SelectOption>;
  placeholder?: string;
  help?: string;
  disabled?: boolean;
  loading?: boolean;
};
export function SelectField({
  id,
  label,
  value,
  onChange,
  items,
  placeholder,
  help,
  disabled,
  loading,
}: SelectFieldProps) {
  const { t } = useI18n();
  const computedPlaceholder =
    placeholder ?? t("admin.fields.select.placeholder");
  const helpId = help ? `${id}-help` : undefined;

  return (
    <div className="space-y-1.5" aria-busy={loading || undefined}>
      {loading && (
        <span role="status" aria-live="polite" className={ATOM.srOnly}>
          {t("admin.actions.loading")}
        </span>
      )}

      {loading ? (
        <SelectFieldSkeleton help={Boolean(help)} />
      ) : (
        <>
          <Label htmlFor={id}>{label}</Label>

          <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger id={id} aria-describedby={helpId} className="w-full">
              <SelectValue placeholder={computedPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {items.map((it) => (
                <SelectItem key={it.value} value={it.value}>
                  {it.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {help ? (
            <p id={helpId} className={cn("text-xs", ATOM.textMuted)}>
              {help}
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}

SelectField.displayName = "SelectField";
