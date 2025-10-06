"use client";
/**
 * @file src/hooks/admin/site/footer/useFooterSettings.ts
 * @intro State + I/O pour les réglages du footer (GET/PATCH) — modèle **UI**
 * @description
 * Fin wrapper autour de `useSettingsResource`, typé sur le modèle **UI** (string+boolean),
 * avec mapping léger DTO(domain) <-> UI + normalisation locale avant save.
 * @layer ui/hooks
 */

import type { ContentState } from "@/constants/shared/common";
import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";

import { DEFAULT_FOOTER_SETTINGS } from "@/core/domain/site/defaults/footer";
import type { FooterSettingsDTO } from "@/core/domain/site/dto";

import {
  useSettingsResource,
  type SettingsHookResult,
} from "@/hooks/_shared/useSettingsResource";

import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";
import { buildShallowDiff } from "@/lib/diff";

import { type FooterSettingsInput } from "@/schemas/site/footer/footer";
import type { UpdateFooterSettingsPatchDTO } from "@/schemas/site/footer/footer-intents";

/* ------------------------------ mapping Domaine (DTO) -> UI ------------------------------ */

function toUi(v: FooterSettingsDTO): FooterSettingsInput {
  return {
    // Toujours une string contrôlée côté UI ("" si null/undefined)
    copyright: (v.copyright ?? "").toString(),
    showYear: Boolean(v.showYear),
  };
}

/* ------------------------------ normalisation UI ------------------------------ */

// Trim “conservatif” : garde "" (ne convertit pas en undefined)
const trimKeepEmpty = (s: string | undefined): string =>
  typeof s === "string" ? s.trim() : "";

/** Normalise un objet COMPLET (toutes props existantes) */
function normalizeFooterInput(i: FooterSettingsInput): FooterSettingsInput {
  // On valide aussi localement si besoin (facultatif) :
  // FooterSettingsSchema.parse({ ... })
  return {
    copyright: trimKeepEmpty(i.copyright),
    showYear: Boolean(i.showYear),
  };
}

/** Normalise un PATCH PARTIEL — ne touche que les clés présentes */
function normalizeFooterPatch(
  p: Partial<FooterSettingsInput>
): UpdateFooterSettingsPatchDTO {
  const out: UpdateFooterSettingsPatchDTO = {};
  if ("copyright" in p) out.copyright = trimKeepEmpty(p.copyright);
  if ("showYear" in p) out.showYear = Boolean(p.showYear);
  return out;
}

/** Defaults UI dérivés des defaults domaine */
const DEFAULT_FOOTER_INPUT: FooterSettingsInput = toUi(DEFAULT_FOOTER_SETTINGS);

/* ------------------------------------- hook ------------------------------------- */

type UseFooterSettingsResult = SettingsHookResult<FooterSettingsInput>;

export function useFooterSettings(
  state: ContentState = DEFAULT_CONTENT_STATE
): UseFooterSettingsResult {
  return useSettingsResource<FooterSettingsInput>({
    state,
    entity: "footer",

    // Toujours travailler en valeurs **normalisées** côté UI
    defaults: normalizeFooterInput(DEFAULT_FOOTER_INPUT),

    // GET → DTO domaine → UI → normalize
    load: async (s, opts) => {
      const dto = await settingsAdminApi.footer.get(s, opts);
      return normalizeFooterInput(toUi(dto));
    },

    // PATCH → normalize UI(partial) → call → DTO → UI → normalize
    save: async (s, next, opts) => {
      const normalizedPatch = normalizeFooterPatch(next);
      const dto = await settingsAdminApi.footer.patch(normalizedPatch, s, opts);
      return normalizeFooterInput(toUi(dto));
    },

    // Diff minimal sur valeurs **normalisées**
    buildPatch: (baseline, next) =>
      buildShallowDiff(
        normalizeFooterInput(baseline),
        normalizeFooterInput(next)
      ) ?? null,

    // (optionnel) Garantit un state interne normalisé
    onLoaded: (val) => normalizeFooterInput(val),
    beforeSave: (val) => normalizeFooterInput(val),
  });
}
