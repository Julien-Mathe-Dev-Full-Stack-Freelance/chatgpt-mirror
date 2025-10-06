"use client";

/**
 * @file src/hooks/admin/site/legal-menu/useLegalMenuSettings.ts
 * @intro State + I/O pour le menu légal (GET/PATCH) — modèle **UI** (schéma Zod)
 * @layer ui/hooks
 */

import type { ContentState } from "@/constants/shared/common";
import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import { DEFAULT_LEGAL_MENU_SETTINGS } from "@/core/domain/site/defaults/legal-menu";
import type { LegalMenuSettingsDTO } from "@/core/domain/site/dto";
import type { LegalMenuItem } from "@/core/domain/site/entities/legal-menu";
import {
  useSettingsResource,
  type SettingsHookResult,
} from "@/hooks/_shared/useSettingsResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";
import { buildShallowDiff } from "@/lib/diff";
import { toExternalDraft, toInternalDraft } from "@/lib/normalize";
import type {
  LegalMenuItemInput,
  LegalMenuSettingsInput,
} from "@/schemas/site/legal-menu/legal-menu";
import type { UpdateLegalMenuSettingsPatchDTO } from "@/schemas/site/legal-menu/legal-menu-intents";

/* ------------------------------ mapping UI <-> domaine ------------------------------ */

/** Domaine (DTO/entité) -> UI (strings) */
function toUi(v: LegalMenuSettingsDTO): LegalMenuSettingsInput {
  return {
    items: v.items.map((it: LegalMenuItem) => ({
      label: it.label,
      href: it.href as string, // brand -> string pour l’UI
      newTab: it.newTab,
      isExternal: it.isExternal,
    })),
  };
}

/* ------------------------------ helpers ------------------------------ */

const coerceString = (s: string) => s.trim();
const coerceBool = (b: boolean) => !!b;

/** Normalise **un item** complet (inclut la normalisation d’URL selon isExternal) */
function normalizeLegalItemInput(i: LegalMenuItemInput): LegalMenuItemInput {
  const href = i.isExternal ? toExternalDraft(i.href) : toInternalDraft(i.href);

  return {
    label: coerceString(i.label),
    href,
    newTab: coerceBool(i.newTab),
    isExternal: coerceBool(i.isExternal),
  };
}

/** Normalise un objet COMPLET (toutes props existantes) */
function normalizeLegalMenuInput(
  s: LegalMenuSettingsInput
): LegalMenuSettingsInput {
  return {
    items: Array.isArray(s.items) ? s.items.map(normalizeLegalItemInput) : [],
  };
}

/** Normalise un PATCH PARTIEL — ne touche que les clés présentes */
function normalizeLegalMenuInputPartial(
  p: Partial<LegalMenuSettingsInput>
): UpdateLegalMenuSettingsPatchDTO {
  const out: UpdateLegalMenuSettingsPatchDTO = {};
  if ("items" in p && Array.isArray(p.items)) {
    out.items = p.items.map(normalizeLegalItemInput);
  }
  return out;
}

/** Defaults UI dérivés des defaults domaine */
const DEFAULT_LEGAL_INPUT: LegalMenuSettingsInput = toUi(
  DEFAULT_LEGAL_MENU_SETTINGS
);

/* ------------------------------------- hook ------------------------------------- */

type UseLegalMenuSettingsResult = SettingsHookResult<LegalMenuSettingsInput>;

export function useLegalMenuSettings(
  state: ContentState = DEFAULT_CONTENT_STATE
): UseLegalMenuSettingsResult {
  return useSettingsResource<LegalMenuSettingsInput>({
    state,
    entity: "legalMenu",
    defaults: normalizeLegalMenuInput(DEFAULT_LEGAL_INPUT),

    // GET published/draft → DTO domaine → UI → normalize (pour garder un state propre)
    load: async (s, opts) => {
      const dto = await settingsAdminApi.legalMenu.get(s, opts);
      return normalizeLegalMenuInput(toUi(dto));
    },

    // PATCH draft (body UI) → normalize (incl. URLs) → DTO → UI → normalize
    save: async (s, next, opts) => {
      const normalizedPatch = normalizeLegalMenuInputPartial(next);
      const dto = await settingsAdminApi.legalMenu.patch(
        normalizedPatch,
        s,
        opts
      );
      return normalizeLegalMenuInput(toUi(dto));
    },

    // Diff minimal sur valeurs normalisées
    buildPatch: (baseline, next) =>
      buildShallowDiff(
        normalizeLegalMenuInput(baseline),
        normalizeLegalMenuInput(next)
      ) ?? null,

    // Garantit un state interne toujours normalisé
    onLoaded: (val) => normalizeLegalMenuInput(val),
    beforeSave: (val) => normalizeLegalMenuInput(val),
  });
}
