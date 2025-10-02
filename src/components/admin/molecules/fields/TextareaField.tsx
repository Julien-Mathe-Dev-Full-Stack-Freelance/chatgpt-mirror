"use client";

import { TextareaFieldSkeleton } from "@/components/admin/molecules/fields/skeletons/TextareaFieldSkeleton";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { cn } from "@/lib/cn";
import type { TextareaHTMLAttributes } from "react";

export interface TextareaFieldProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "id" | "value" | "onChange" | "placeholder" | "rows" | "disabled"
  > {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  help?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function TextareaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  help,
  disabled,
  loading,
  ...textareaProps
}: TextareaFieldProps) {
  const { t } = useI18n();
  const helpId = help ? `${id}-help` : undefined;

  return (
    <div aria-busy={loading || undefined}>
      {loading && (
        <span role="status" aria-live="polite" className={ATOM.srOnly}>
          {t("ui.loading")}
        </span>
      )}

      {loading ? (
        <TextareaFieldSkeleton help={Boolean(help)} />
      ) : (
        <>
          <Label htmlFor={id}>{label}</Label>
          {help ? (
            <p id={helpId} className={cn("text-xs", ATOM.textMuted)}>
              {help}
            </p>
          ) : null}

          <Textarea
            id={id}
            rows={rows}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-describedby={helpId}
            disabled={disabled}
            {...textareaProps}
          />
        </>
      )}
    </div>
  );
}

TextareaField.displayName = "TextareaField";
