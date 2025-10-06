/**
 * @file src/core/domain/site/use-cases/seo/update-seo-settings.ts
 * @intro Use-case : appliquer un patch sur `settings.seo`.
 * @description
 * Charge les réglages, applique un **merge superficiel (shallow)** de `seo` avec le patch,
 * puis persiste. La validation de **forme** reste à la frontière API (Zod).
 *
 * Observabilité :
 * - `info`  : début/fin avec durée
 * - `debug` : étapes clés (ensureBase, lecture, écriture) + clés du patch
 *
 * @remarks
 * - Le merge est **shallow** (clé à clé). Si des sous-objets imbriqués apparaissent,
 *   envisager un merge profond ciblé côté use-case/adapters.
 * - `state` par défaut : `"draft"`.
 * @layer domain/use-case
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/core/domain/constants/common";

import type { SeoSettingsDTO } from "@/core/domain/site/dto";
import type { SiteSettings } from "@/core/domain/site/entities/site-settings";
import type {
  UpdateSeoSettingsDeps,
  UpdateSeoSettingsInput,
  UpdateSeoSettingsResult,
} from "@/core/domain/site/use-cases/seo/update-seo-settings.types";
import { log, logWithDuration } from "@/lib/log";
import { shallowMergeWithChangedKeys } from "@/lib/merge";

/**
 * Fabrique le use-case `updateSeoSettings`.
 * @param deps - Dépendances injectées (repository site).
 *   - `repo` : dépôt agrégat site (index/settings).
 * @returns Une fonction `run(input)` qui applique le patch et renvoie `{ settings }`.
 */
export function updateSeoSettings({ repo }: UpdateSeoSettingsDeps) {
  const logger = log.child({ uc: "updateSeoSettings" });

  /**
   * Exécute la mise à jour des réglages SEO.
   * @param input - `{ state?, patch }` (merge **shallow** sur `settings.seo`).
   * @returns `{ settings }` : réglages après écriture.
   */
  return async function run(
    input: UpdateSeoSettingsInput
  ): Promise<UpdateSeoSettingsResult> {
    return logWithDuration("uc.updateSeoSettings", async () => {
      const state: ContentState = input.state ?? DEFAULT_CONTENT_STATE;
      const patch: Partial<SeoSettingsDTO> = input.patch ?? {};
      const patchKeys = Object.keys(patch);

      logger.info("start", { state, patchKeysCount: patchKeys.length });

      await repo.ensureBase();
      logger.debug("persist.ensureBase.ok", { state });

      const current = await repo.readSettings(state);
      logger.debug("settings.read", { state });

      const { next: seoNext, changedKeys } =
        shallowMergeWithChangedKeys<SeoSettingsDTO>(current.seo, patch);

      if (changedKeys.length === 0) {
        logger.info("ok.noop", { state });
        return { settings: current };
      }

      // Pas de validation métier ici (publish-only via assert*Settings)
      const next: SiteSettings = { ...current, seo: seoNext };

      await repo.writeSettings(state, next);
      logger.debug("settings.written", {
        state,
        patchKeys,
        changedKeys,
        changedCount: changedKeys.length,
      });

      logger.info("ok", { state });
      return { settings: next };
    });
  };
}
