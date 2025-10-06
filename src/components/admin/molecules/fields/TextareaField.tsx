"use client";

/**
 * @file src/components/admin/molecules/fields/TextareaField.tsx
 * @intro Champ texte long (label, aide, erreur, compteur)
 */

import { FieldMetaBar } from "@/components/admin/molecules/fields/FieldMetaBar";
import { TextareaFieldSkeleton } from "@/components/admin/molecules/fields/skeletons/TextareaFieldSkeleton";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { cn } from "@/lib/cn";
import type { ReactNode, TextareaHTMLAttributes } from "react";

interface TextareaFieldProps
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
  help?: string | ReactNode;
  /** Message d’erreur affiché sous le champ. */
  error?: string;
  /** Force le style “invalid” (rouge) sans message. */
  invalid?: boolean;
  disabled?: boolean;
  loading?: boolean;
  /** Active le compteur via FieldMetaBar (utilise `maxLength` si fourni). */
  showCount?: boolean;
  /** Personnalise la tonalité du compteur. */
  counterToneFor?: (
    current: number,
    max?: number
  ) => "muted" | "success" | "warning" | "destructive";
}

export function TextareaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  help,
  error,
  invalid,
  disabled,
  loading,
  showCount = false,
  counterToneFor,
  ...textareaProps
}: TextareaFieldProps) {
  const { t } = useI18n();

  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  const max =
    typeof textareaProps.maxLength === "number"
      ? textareaProps.maxLength
      : undefined;

  const isInvalid = Boolean(error) || Boolean(invalid);

  return (
    <div className="space-y-1.5" aria-busy={loading || undefined}>
      {loading && (
        <span role="status" aria-live="polite" className={ATOM.srOnly}>
          {t("admin.actions.loading")}
        </span>
      )}

      {loading ? (
        <TextareaFieldSkeleton help={Boolean(help) || Boolean(error)} />
      ) : (
        <>
          <Label htmlFor={id}>{label}</Label>

          <Textarea
            id={id}
            rows={rows}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-describedby={describedBy}
            aria-invalid={isInvalid ? true : undefined}
            disabled={disabled}
            className={cn(
              isInvalid && "border-destructive focus-visible:ring-destructive"
            )}
            {...textareaProps}
          />

          {(help || showCount) && (
            <FieldMetaBar
              left={
                help ? (
                  <p id={helpId} className={cn(ATOM.textMuted)}>
                    {help}
                  </p>
                ) : undefined
              }
              counter={
                showCount
                  ? {
                      current: value.length,
                      max,
                      toneFor: counterToneFor,
                    }
                  : undefined
              }
            />
          )}

          {error && (
            <p id={errorId} role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}
        </>
      )}
    </div>
  );
}

TextareaField.displayName = "TextareaField";
