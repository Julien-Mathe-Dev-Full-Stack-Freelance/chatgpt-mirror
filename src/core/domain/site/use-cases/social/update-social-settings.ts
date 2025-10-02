/**
 * @file src/core/domain/site/use-cases/social/update-social-settings.ts
 * @intro Use-case : appliquer un patch sur `settings.social`.
 * @description
 * Charge les réglages, applique un **merge superficiel (shallow)** de `social` avec le patch,
 * puis persiste. La validation de **forme** reste à la frontière API (Zod).
 *
 * Observabilité :
 * - `info`  : début/fin avec durée
 * - `debug` : étapes clés (ensureBase, lecture, écriture) + clés du patch
 *
 * @remarks
 * - Le merge est **shallow** (clé à clé). Si des sous-objets apparaissent plus tard,
 *   envisager un merge profond ciblé côté use-case/adapters.
 * - `state` par défaut : `"draft"`.
 * @layer domain/use-case
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/core/domain/constants/common";
import { isDomainError } from "@/core/domain/errors/domain-error";
import type { SocialSettingsDTO } from "@/core/domain/site/dto";
import type { SiteSettings } from "@/core/domain/site/entities/site-settings";
import { UpdateSocialSettingsError } from "@/core/domain/site/use-cases/social/update-social-settings.errors";
import type {
  UpdateSocialSettingsDeps,
  UpdateSocialSettingsInput,
  UpdateSocialSettingsResult,
} from "@/core/domain/site/use-cases/social/update-social-settings.types";
import { assertSocialSettings } from "@/core/domain/site/validators/social";
import { log, logWithDuration } from "@/lib/log";
import { shallowMergeWithChangedKeys } from "@/lib/merge";

/**
 * Fabrique le use-case `updateSocialSettings`.
 * @param deps - Dépendances injectées (repository site).
 *   - `repo` : dépôt agrégat site (index/settings).
 * @returns Une fonction `run(input)` qui applique le patch et renvoie `{ settings }`.
 */
export function updateSocialSettings({ repo }: UpdateSocialSettingsDeps) {
  const logger = log.child({ uc: "updateSocialSettings" });

  return async function run(
    input: UpdateSocialSettingsInput
  ): Promise<UpdateSocialSettingsResult> {
    return logWithDuration("uc.updateSocialSettings", async () => {
      const state: ContentState = input.state ?? DEFAULT_CONTENT_STATE;
      const patch: Partial<SocialSettingsDTO> = input.patch ?? {};
      const patchKeys = Object.keys(patch);

      logger.info("start", { state, patchKeysCount: patchKeys.length });

      await repo.ensureBase();
      const current = await repo.readSettings(state);

      const { next: socialNext, changedKeys } =
        shallowMergeWithChangedKeys<SocialSettingsDTO>(current.social, patch);

      if (changedKeys.length === 0) {
        logger.info("ok.noop", { state });
        return { settings: current };
      }

      // 🔒 Invariants métier (SoT) — on mappe DomainError → UpdateSocialSettingsError
      try {
        // cast DTO→entité si SocialSettingsDTO est Readonly (structure identique)
        assertSocialSettings(socialNext as unknown as SiteSettings["social"]);
      } catch (e) {
        if (isDomainError(e)) {
          logger.warn("social.rules.failed", {
            code: e.code,
            details: e.details,
          });
          throw new UpdateSocialSettingsError(e.code, e.message, e.details, e);
        }
        throw e;
      }

      const next: SiteSettings = { ...current, social: socialNext };
      await repo.writeSettings(state, next);
      logger.info("ok", { state, changedCount: changedKeys.length });

      return { settings: next };
    });
  };
}
