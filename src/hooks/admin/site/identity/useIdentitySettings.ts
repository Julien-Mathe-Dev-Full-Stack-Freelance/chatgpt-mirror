"use client";

/**
 * @file src/hooks/admin/site/identity/useIdentitySettings.ts
 * @intro State + I/O pour l'identité (GET/PATCH) — modèle **UI** (schéma Zod)
 * @description
 * Fin wrapper autour de `useSettingsResource`, typé sur le modèle **UI** (strings),
 * avec mapping léger DTO(domain) <-> UI + normalisation locale avant save.
 * @layer ui/hooks
 */

import type { ContentState } from "@/constants/shared/common";
import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import { DEFAULT_IDENTITY_SETTINGS } from "@/core/domain/site/defaults/identity";
import type { IdentitySettingsDTO } from "@/core/domain/site/dto";
import {
  useSettingsResource,
  type SettingsHookResult,
} from "@/hooks/_shared/useSettingsResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";
import { buildShallowDiff } from "@/lib/diff";
import type { IdentitySettingsInput } from "@/schemas/site/identity/identity";
import type { UpdateIdentitySettingsPatchDTO } from "@/schemas/site/identity/identity-intents";

/* ------------------------------ mapping UI <-> domaine ------------------------------ */

// — Helpers de normalisation —
// Trim "plein" : si string -> .trim(), sinon laisse tel quel.
// Ne convertit JAMAIS "" -> undefined.
const trimKeepEmpty = (s: string | undefined): string | undefined =>
  typeof s === "string" ? s.trim() : s;

// Domaine (DTO/entité) -> UI (strings)
// IMPORTANT : si le domaine a `null`, côté UI on préfère "" pour rester contrôlé et
// permettre un diff clair entre ancienne valeur et "".
function toUi(v: IdentitySettingsDTO): IdentitySettingsInput {
  return {
    title: v.title,
    tagline: v.tagline ?? "",
    logoLightUrl: v.logoLightUrl ?? "",
    logoDarkUrl: v.logoDarkUrl ?? "",
    logoAlt: v.logoAlt,
    faviconLightUrl: v.faviconLightUrl ?? "",
    faviconDarkUrl: v.faviconDarkUrl ?? "",
  };
}

// Normalise un objet COMPLET (toutes props existantes) — PAS de coerce "" -> undefined
function normalizeIdentityInput(
  i: IdentitySettingsInput
): IdentitySettingsInput {
  return {
    title: trimKeepEmpty(i.title) ?? "",
    tagline: trimKeepEmpty(i.tagline) ?? "",
    logoLightUrl: trimKeepEmpty(i.logoLightUrl) ?? "",
    logoDarkUrl: trimKeepEmpty(i.logoDarkUrl) ?? "",
    logoAlt: trimKeepEmpty(i.logoAlt) ?? "",
    faviconLightUrl: trimKeepEmpty(i.faviconLightUrl) ?? "",
    faviconDarkUrl: trimKeepEmpty(i.faviconDarkUrl) ?? "",
  };
}

// Normalise un PATCH PARTIEL — ne touche que les clés présentes
// Si l’utilisateur vide un champ → on garde "" (clear explicite)
function normalizeIdentityInputPartial(
  p: Partial<IdentitySettingsInput>
): UpdateIdentitySettingsPatchDTO {
  const out: UpdateIdentitySettingsPatchDTO = {};

  if ("title" in p) out.title = trimKeepEmpty(p.title) ?? "";
  if ("tagline" in p) out.tagline = trimKeepEmpty(p.tagline) ?? "";
  if ("logoLightUrl" in p)
    out.logoLightUrl = trimKeepEmpty(p.logoLightUrl) ?? "";
  if ("logoDarkUrl" in p) out.logoDarkUrl = trimKeepEmpty(p.logoDarkUrl) ?? "";
  if ("logoAlt" in p) out.logoAlt = trimKeepEmpty(p.logoAlt) ?? "";
  if ("faviconLightUrl" in p)
    out.faviconLightUrl = trimKeepEmpty(p.faviconLightUrl) ?? "";
  if ("faviconDarkUrl" in p)
    out.faviconDarkUrl = trimKeepEmpty(p.faviconDarkUrl) ?? "";

  return out;
}

/** Defaults UI dérivés des defaults domaine */
const DEFAULT_IDENTITY_INPUT: IdentitySettingsInput = toUi(
  DEFAULT_IDENTITY_SETTINGS
);

/* ------------------------------------- hook ------------------------------------- */

type UseIdentitySettingsResult = SettingsHookResult<IdentitySettingsInput>;

/**
 * Hook Identity — exposé en **modèle UI** (strings)
 * - load: GET DTO -> map UI -> normalize
 * - save: PATCH UI(normalize) -> retour DTO -> map UI -> normalize
 * - diff: shallow (après normalize) pour éviter les patchs bruités
 */
export function useIdentitySettings(
  state: ContentState = DEFAULT_CONTENT_STATE
): UseIdentitySettingsResult {
  return useSettingsResource<IdentitySettingsInput>({
    state,
    entity: "identity",
    defaults: normalizeIdentityInput(DEFAULT_IDENTITY_INPUT),

    // GET published/draft → DTO domaine → UI → normalize (trim/undefined)
    load: async (s, opts) => {
      const dto = await settingsAdminApi.identity.get(s, opts);
      return normalizeIdentityInput(toUi(dto));
    },

    // PATCH draft (body UI) → normalize avant diff/save → DTO → UI → normalize
    save: async (s, next, opts) => {
      const normalizedPatch = normalizeIdentityInputPartial(next);
      const dto = await settingsAdminApi.identity.patch(
        normalizedPatch,
        s,
        opts
      );
      return normalizeIdentityInput(toUi(dto));
    },

    // Diff minimal sur valeurs normalisées
    buildPatch: (baseline, next) =>
      buildShallowDiff(
        normalizeIdentityInput(baseline),
        normalizeIdentityInput(next)
      ) ?? null,

    // (optionnel) Si tu veux garantir le state interne toujours normalisé :
    onLoaded: (val) => normalizeIdentityInput(val),
    beforeSave: (val) => normalizeIdentityInput(val),
  });
}
