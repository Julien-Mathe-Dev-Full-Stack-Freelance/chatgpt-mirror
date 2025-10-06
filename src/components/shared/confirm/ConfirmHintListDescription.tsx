"use client";

/**
 * @file src/components/shared/confirm/ConfirmHintListDescription.tsx
 * @intro Description de la liste de messages d’avertissement (i18n)
 */

import { HintList } from "@/components/admin/molecules/HintList";

export function ConfirmHintListDescription({
  intro,
  hints,
  variant = "warning",
  dense = true,
}: {
  intro?: React.ReactNode; // ex: “Vous pouvez continuer…”
  hints: ReadonlyArray<React.ReactNode>; // déjà traduits
  variant?: "info" | "warning" | "success" | "error";
  dense?: boolean;
}) {
  return (
    <div className="space-y-2 text-sm">
      {intro ? <p className="text-muted-foreground">{intro}</p> : null}
      <HintList hints={hints} variant={variant} dense={dense} />
    </div>
  );
}
