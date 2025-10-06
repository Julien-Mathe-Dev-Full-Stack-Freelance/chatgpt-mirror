"use client";

/**
 * @file src/components/shared/confirm/ConfirmDialogProvider.tsx
 * @intro Dialogue de confirmation (contexte + provider)
 */

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createContext, useCallback, useMemo, useState } from "react";

type ConfirmTone = "default" | "danger";

export type ConfirmOptions = {
  title?: React.ReactNode;
  description?: React.ReactNode; // string ou contenu riche
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmTone;
  requireAcknowledge?: { label: string };
};

type InternalState = ConfirmOptions & {
  open: boolean;
  resolve?: (v: boolean) => void;
};

export const ConfirmContext = createContext<{
  confirm: (opts?: ConfirmOptions) => Promise<boolean>;
} | null>(null);

export function ConfirmDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<InternalState>({ open: false });
  const [ack, setAck] = useState<boolean>(false); // ← state (pas ref) pour déclencher un render

  const confirm = useCallback((opts?: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setAck(false); // reset à l’ouverture
      setState({
        open: true,
        resolve,
        title: opts?.title ?? "Confirmer l’action",
        description: opts?.description ?? "",
        confirmLabel: opts?.confirmLabel ?? "Confirmer",
        cancelLabel: opts?.cancelLabel ?? "Annuler",
        tone: opts?.tone ?? "default",
        requireAcknowledge: opts?.requireAcknowledge,
      });
    });
  }, []);

  const onClose = useCallback(
    () => setState((s) => ({ ...s, open: false })),
    []
  );

  const onCancel = useCallback(() => {
    state.resolve?.(false);
    onClose();
  }, [state, onClose]);

  const onConfirm = useCallback(() => {
    if (state.requireAcknowledge && !ack) return;
    state.resolve?.(true);
    onClose();
  }, [state, ack, onClose]);

  const value = useMemo(() => ({ confirm }), [confirm]);

  // helper: description riche vs texte
  const isPlainText =
    typeof state.description === "string" ||
    typeof state.description === "number";

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <Dialog open={state.open} onOpenChange={(o) => !o && onCancel()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle
              className={
                state.tone === "danger" ? "text-destructive" : undefined
              }
            >
              {state.title}
            </DialogTitle>

            {!!state.description &&
              (isPlainText ? (
                <DialogDescription>{state.description}</DialogDescription>
              ) : (
                // Ne pas imbriquer de <div> dans <DialogDescription> (qui rend un <p>)
                <div className="text-sm text-muted-foreground">
                  {state.description}
                </div>
              ))}
          </DialogHeader>

          {state.requireAcknowledge && (
            <label className="mt-2 flex items-center gap-2 text-sm">
              <Checkbox
                checked={ack}
                onCheckedChange={(v) => setAck(v === true)}
              />
              <span>{state.requireAcknowledge.label}</span>
            </label>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={onCancel}>
              {state.cancelLabel}
            </Button>
            <Button
              onClick={onConfirm}
              variant={state.tone === "danger" ? "destructive" : "default"}
              disabled={!!state.requireAcknowledge && !ack}
            >
              {state.confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
}
