/**
 * @file src/components/admin/molecules/fields/InputField.tsx
 * @intro Champ texte contrôlé (label, aide, erreur, compteur)
 * @layer ui/presentational
 * @description
 * - A11y : `aria-invalid`, chainage `aria-describedby` (help + error), message d’erreur annoncé.
 * - Compteur : si `showCount` est vrai **et** que `maxLength` est fourni (prop native HTML),
 *   on affiche `current / max`. Le compteur est décoratif, non annoncé au lecteur d’écran.
 */

"use client";

import { InputFieldSkeleton } from "@/components/admin/molecules/fields/skeletons/InputFieldSkeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
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
  /** Message d’erreur affiché sous le champ. */
  error?: string;
  /** Force le style “invalid” (rouge) sans message. */
  invalid?: boolean;
  disabled?: boolean;
  loading?: boolean;
  /** Affiche un compteur `value.length / maxLength` si maxLength est fourni. */
  showCount?: boolean;
}

export function InputField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  help,
  error,
  invalid,
  disabled,
  loading,
  showCount = false,
  ...inputProps
}: InputFieldProps) {
  const { t } = useI18n();

  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  const max =
    typeof inputProps.maxLength === "number" ? inputProps.maxLength : undefined;
  const showCounter = Boolean(showCount && typeof max === "number");

  const isInvalid = Boolean(error) || Boolean(invalid);

  return (
    <div className="space-y-1.5" aria-busy={loading || undefined}>
      {loading && (
        <span role="status" aria-live="polite" className={ATOM.srOnly}>
          {t("admin.actions.loading")}
        </span>
      )}

      {loading ? (
        <InputFieldSkeleton help={Boolean(help) || Boolean(error)} />
      ) : (
        <>
          <Label htmlFor={id}>{label}</Label>

          <Input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-describedby={describedBy}
            aria-invalid={isInvalid ? true : undefined}
            disabled={disabled}
            className={cn(
              isInvalid && "border-destructive focus-visible:ring-destructive"
            )}
            {...inputProps}
          />

          {(help || showCounter) && (
            <div className="flex items-start justify-between">
              {help ? (
                <p id={helpId} className={cn("text-xs", ATOM.textMuted)}>
                  {help}
                </p>
              ) : (
                <span />
              )}

              {showCounter && (
                <p
                  className={cn("text-xs tabular-nums", ATOM.textMuted)}
                  aria-hidden="true"
                >
                  {value.length}/{max}
                </p>
              )}
            </div>
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

InputField.displayName = "InputField";
