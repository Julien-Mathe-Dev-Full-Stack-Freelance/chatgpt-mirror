"use client";

/**
 * @file src/components/admin/molecules/fields/FieldMetaBar.tsx
 * @intro Affiche une barre meta sous un champ.
 */

import { ATOM } from "@/infrastructure/ui/atoms";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/**
 * Affiche une barre meta sous un champ :
 * - à gauche : aide / hint contextuel (optionnel)
 * - à droite : compteur "current / max" (optionnel) avec tonalité
 *
 * Tonalité :
 *  - "success"   → texte vert
 *  - "warning"   → texte orange
 *  - "destructive" → texte rouge
 *  - "muted" (default)
 */
export type FieldMetaTone = "muted" | "success" | "warning" | "destructive";

export type CounterSpec = Readonly<{
  /** Longueur courante (ex. value.length) */
  current: number;
  /** Maximum affiché (ex. SEO_DESCRIPTION_MAX ou maxLength HTML) */
  max?: number;
  /**
   * Détermine la tonalité selon la valeur courante.
   * Si omis → "muted".
   */
  toneFor?: (current: number, max?: number) => FieldMetaTone;
}>;

export function FieldMetaBar({
  left,
  counter,
  className,
}: {
  left?: ReactNode;
  counter?: CounterSpec;
  className?: string;
}) {
  const tone: FieldMetaTone =
    counter?.toneFor?.(counter.current, counter.max) ?? "muted";

  const toneClass =
    tone === "success"
      ? "text-emerald-600"
      : tone === "warning"
      ? "text-orange-500"
      : tone === "destructive"
      ? "text-destructive"
      : ATOM.textMuted;

  return (
    <div
      className={cn(
        "mt-1 flex items-start justify-between text-xs",
        ATOM.textMuted,
        className
      )}
    >
      {left ? <span className="pr-3">{left}</span> : <span />}
      {counter ? (
        <span className={cn("tabular-nums font-medium", toneClass)} aria-hidden>
          {counter.current}
          {typeof counter.max === "number" ? `/${counter.max}` : null}
        </span>
      ) : null}
    </div>
  );
}

FieldMetaBar.displayName = "FieldMetaBar";
