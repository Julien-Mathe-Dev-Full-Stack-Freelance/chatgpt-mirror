"use client";

/**
 * @file src/hooks/_shared/useConfirm.ts
 * @intro Hook pour la confirmation (contexte + provider)
 */

import {
  ConfirmContext,
  type ConfirmOptions,
} from "@/components/shared/confirm/ConfirmDialogProvider";
import { useContext } from "react";

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within <ConfirmDialogProvider>");
  }
  return ctx.confirm as (opts?: ConfirmOptions) => Promise<boolean>;
}
