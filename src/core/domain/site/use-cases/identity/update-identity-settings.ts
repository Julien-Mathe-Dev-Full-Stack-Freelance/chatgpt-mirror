/**
 * @file src/core/domain/site/use-cases/identity/update-identity-settings.ts
 * @intro Use-case : appliquer un patch sur `settings.identity`.
 * @description
 * Charge les réglages, applique un **merge superficiel (shallow)** de `identity` avec le patch,
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
import type { IdentitySettingsDTO } from "@/core/domain/site/dto";
import type { SiteSettings } from "@/core/domain/site/entities/site-settings";
import { UpdateIdentitySettingsError } from "@/core/domain/site/use-cases/identity/update-identity-settings.errors";
import type {
  UpdateIdentitySettingsDeps,
  UpdateIdentitySettingsInput,
  UpdateIdentitySettingsResult,
} from "@/core/domain/site/use-cases/identity/update-identity-settings.types";
import { log, logWithDuration } from "@/lib/log";
import { shallowMergeWithChangedKeys } from "@/lib/merge";

/**
 * Fabrique le use-case `updateIdentitySettings`.
 * @param deps - Dépendances injectées (repository site).
 *   - `repo` : dépôt agrégat site (index/settings).
 * @returns Une fonction `run(input)` qui applique le patch et renvoie `{ settings }`.
 */
export function updateIdentitySettings({ repo }: UpdateIdentitySettingsDeps) {
  const logger = log.child({ uc: "updateIdentitySettings" });

  /**
   * Exécute la mise à jour des réglages Identity.
   * @param input - `{ state?, patch }` (merge **shallow** sur `settings.identity`).
   * @returns `{ settings }` : réglages après écriture.
   */
  return async function run(
    input: UpdateIdentitySettingsInput
  ): Promise<UpdateIdentitySettingsResult> {
    return logWithDuration("uc.updateIdentitySettings", async () => {
      const state: ContentState = input.state ?? DEFAULT_CONTENT_STATE;
      const patch: Partial<IdentitySettingsDTO> = input.patch ?? {};
      const patchKeys = Object.keys(patch);

      logger.info("start", { state, patchKeysCount: patchKeys.length });

      // 1) Garantir la base
      await repo.ensureBase();
      logger.debug("persist.ensureBase.ok", { state });

      // 2) Lire l’état courant
      const current = await repo.readSettings(state);
      logger.debug("settings.read", { state });

      // 3) Merge **shallow** sur identity + clés effectivement modifiées
      const { next: identityNext, changedKeys } =
        shallowMergeWithChangedKeys<IdentitySettingsDTO>(
          current.identity,
          patch
        );

      // 4) No-op → rien à écrire
      if (changedKeys.length === 0) {
        logger.info("ok.noop", { state });
        return { settings: current };
      }

      // 5) Persistance
      const next: SiteSettings = { ...current, identity: identityNext };
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
