"use client";

import { cn } from "@/lib/cn";
import { ATOM } from "@/infrastructure/ui/atoms";

/**
 * @file src/components/admin/molecules/EmptyHint.tsx
 * @intro Message d’état vide (inline, discret)
 * @description Texte court et neutre, couleur atténuée. Aucune logique.
 * Observabilité : Aucune (présentation pure).
 * @layer ui/molecules
 */

export function EmptyHint({ text }: { text: string }) {
  return <p className={cn("text-sm", ATOM.textMuted)}>{text}</p>;
}
