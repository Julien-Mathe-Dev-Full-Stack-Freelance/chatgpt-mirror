"use client";

/**
 * @file src/hooks/_shared/useConfirmList.tsx
 * @intro Hook pour la confirmation (contexte + provider)
 */

import { ConfirmHintListDescription } from "@/components/shared/confirm/ConfirmHintListDescription";
import { useConfirm } from "@/hooks/_shared/useConfirm";

type ConfirmListParams = {
  title: React.ReactNode; // déjà traduit
  intro?: React.ReactNode; // déjà traduit
  items: ReadonlyArray<React.ReactNode>; // déjà traduits
  confirmLabel?: string;
  cancelLabel?: string;
  requireAckLabel?: string;
  tone?: "default" | "danger";
};

export function useConfirmList() {
  const confirm = useConfirm();

  return async function confirmList({
    title,
    intro,
    items,
    confirmLabel = "Continuer",
    cancelLabel = "Annuler",
    requireAckLabel,
    tone = "default",
  }: ConfirmListParams): Promise<boolean> {
    return confirm({
      title,
      description: (
        <ConfirmHintListDescription
          intro={intro}
          hints={items}
          variant="warning"
        />
      ),
      confirmLabel,
      cancelLabel,
      tone,
      requireAcknowledge: requireAckLabel
        ? { label: requireAckLabel }
        : undefined,
    });
  };
}
