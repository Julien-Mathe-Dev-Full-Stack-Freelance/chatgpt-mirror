"use client";

/**
 * @file src/components/admin/molecules/fields/InputField.tsx
 * @intro Champ texte contrôlé (label, aide, erreur, compteur)
 */

import { FieldMetaBar } from "@/components/admin/molecules/fields/FieldMetaBar";
import { InputFieldSkeleton } from "@/components/admin/molecules/fields/skeletons/InputFieldSkeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { cn } from "@/lib/cn";
import type {
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  ReactNode,
} from "react";

interface InputFieldProps
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
  help?: string | ReactNode;
  /** Message d’erreur affiché sous le champ. */
  error?: string;
  /** Force le style “invalid” (rouge) sans message. */
  invalid?: boolean;
  disabled?: boolean;
  loading?: boolean;
  /**
   * Affiche un compteur via FieldMetaBar si `showCount` est vrai.
   * Si `maxLength` n'est pas fourni, on affiche seulement la valeur courante.
   */
  showCount?: boolean;
  /** Personnalise la tonalité du compteur. */
  counterToneFor?: (
    current: number,
    max?: number
  ) => "muted" | "success" | "warning" | "destructive";
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
  counterToneFor,
  ...inputProps
}: InputFieldProps) {
  const { t } = useI18n();

  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  const max =
    typeof inputProps.maxLength === "number" ? inputProps.maxLength : undefined;

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

InputField.displayName = "InputField";
