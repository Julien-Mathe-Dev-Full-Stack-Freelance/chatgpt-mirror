"use client";

/**
 * @file src/hooks/admin/site/theme/usePalette.ts
 * @intro Hook client pour la palette de thème (admin)
 * @description
 * Gère une préférence **locale** de palette (localStorage) et applique
 * l’attribut `data-theme` sur le scope admin (`.admin-theme` si présent, sinon `<html>`).
 * Expose `{ palette, setPalette, palettes }`.
 *
 * Observabilité :
 * - `debug` : init/apply/set + sync inter-onglets
 *
 * @layer ui/hooks
 * @remarks
 * - SSR-safe : on vérifie l’existence de `document`/`localStorage`.
 * - La palette ici est **UI-locale** (préférence admin), indépendante des réglages publiés.
 * - Sync inter-onglets via l’événement `storage`.
 * @todo Offrir une option `scopeSelector` si on souhaite cibler un autre conteneur qu’`.admin-theme`.
 */

import { useCallback, useEffect, useState } from "react";
import { log } from "@/lib/log";

const lg = log.child({ ns: "hook", name: "usePalette" });

export const PALETTES = ["neutral", "ocean", "violet", "forest"] as const;
export type Palette = (typeof PALETTES)[number];

const STORAGE_KEY = "ui-palette";
const DEFAULT: Palette = "neutral";

/** Garde de type pour s’assurer qu’une valeur est une `Palette`. */
function isPalette(v: unknown): v is Palette {
  return typeof v === "string" && (PALETTES as readonly string[]).includes(v);
}

/**
 * Hook React : préférence de palette pour l’UI admin.
 * - Persiste/charge depuis `localStorage`.
 * - Applique `data-theme="<palette>"` au scope (admin ou <html>).
 *
 * @returns `{ palette, setPalette, palettes }`
 */
export function usePalette() {
  const [palette, setPaletteState] = useState<Palette>(DEFAULT);

  /**
   * Applique la palette au DOM (attribut `data-theme`).
   * N’opère que côté client.
   */
  const apply = useCallback((p: Palette) => {
    if (typeof document === "undefined") return;
    const scope =
      document.querySelector<HTMLElement>(".admin-theme") ??
      document.documentElement;
    scope.setAttribute("data-theme", p);
    lg.debug("apply", {
      value: p,
      scope: scope === document.documentElement ? "html" : ".admin-theme",
    });
  }, []);

  // Init depuis localStorage (une seule fois)
  useEffect(() => {
    try {
      const raw =
        typeof localStorage !== "undefined"
          ? localStorage.getItem(STORAGE_KEY)
          : null;

      const initial: Palette = isPalette(raw) ? raw : DEFAULT;

      setPaletteState(initial);
      apply(initial);
      lg.debug("init", { fromStorage: Boolean(raw), value: initial });
    } catch {
      apply(DEFAULT);
      lg.debug("init.fallback", { value: DEFAULT });
    }
  }, [apply]);

  // Synchronisation inter-onglets (si un autre onglet change la palette)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !isPalette(e.newValue)) return;
      const next = e.newValue;
      setPaletteState(next);
      apply(next);
      lg.debug("sync.storage", { value: next });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [apply]);

  /**
   * Met à jour la palette courante :
   * - met à jour le state,
   * - persiste dans `localStorage`,
   * - applique sur le DOM (data-theme).
   */
  const setPalette = useCallback(
    (p: Palette) => {
      if (!isPalette(p)) return;
      setPaletteState(p);
      try {
        localStorage.setItem(STORAGE_KEY, p);
      } catch {
        // no-op (mode privé / quota)
      }
      apply(p);
      lg.debug("set", { value: p });
    },
    [apply]
  );

  return { palette, setPalette, palettes: PALETTES } as const;
}
