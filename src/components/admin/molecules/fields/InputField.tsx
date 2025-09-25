"use client";

import { InputFieldSkeleton } from "@/components/admin/molecules/fields/skeletons/InputFieldSkeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ATOM } from "@/infrastructure/ui/atoms";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/cn";
import type { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

export interface InputFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "id" | "value" | "onChange" | "type" | "placeholder" | "disabled"
  > {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  help?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function InputField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  help,
  disabled,
  loading,
  ...inputProps
}: InputFieldProps) {
  const { t } = useI18n();
  const helpId = help ? `${id}-help` : undefined;

  return (
    <div className="space-y-1.5" aria-busy={loading || undefined}>
      {loading && (
        <span role="status" aria-live="polite" className={ATOM.srOnly}>
          {t("ui.loading")}
        </span>
      )}

      {loading ? (
        <InputFieldSkeleton help={Boolean(help)} />
      ) : (
        <>
          <Label htmlFor={id}>{label}</Label>
          <Input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-describedby={helpId}
            disabled={disabled}
            {...inputProps}
          />
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

InputField.displayName = "InputField";
