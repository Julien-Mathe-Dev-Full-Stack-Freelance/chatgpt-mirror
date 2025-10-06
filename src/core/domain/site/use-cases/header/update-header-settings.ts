/**
 * @file src/core/domain/site/use-cases/header/update-header-settings.ts
 * @intro Use-case : appliquer un patch sur `settings.header`.
 * @description
 * Charge les réglages, applique un **merge superficiel (shallow)** de `header` avec le patch,
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
import type { HeaderSettingsDTO } from "@/core/domain/site/dto";
import type { SiteSettings } from "@/core/domain/site/entities/site-settings";
import type {
  UpdateHeaderSettingsDeps,
  UpdateHeaderSettingsInput,
  UpdateHeaderSettingsResult,
} from "@/core/domain/site/use-cases/header/update-header-settings.types";
import { log, logWithDuration } from "@/lib/log";
import { shallowMergeWithChangedKeys } from "@/lib/merge";

/**
 * Fabrique le use-case `updateHeaderSettings`.
 * @param deps - Dépendances injectées (repository site).
 *   - `repo` : dépôt agrégat site (index/settings).
 * @returns Une fonction `run(input)` qui applique le patch et renvoie `{ settings }`.
 */
export function updateHeaderSettings({ repo }: UpdateHeaderSettingsDeps) {
  const logger = log.child({ uc: "updateHeaderSettings" });

  /**
   * Exécute la mise à jour des réglages Header.
   * @param input - `{ state?, patch }` (merge **shallow** sur `settings.header`).
   * @returns `{ settings }` : réglages après écriture.
   */
  return async function run(
    input: UpdateHeaderSettingsInput
  ): Promise<UpdateHeaderSettingsResult> {
    return logWithDuration("uc.updateHeaderSettings", async () => {
      const state: ContentState = input.state ?? DEFAULT_CONTENT_STATE;
      const patch: Partial<HeaderSettingsDTO> = input.patch ?? {};
      const patchKeys = Object.keys(patch);

      logger.info("start", { state, patchKeysCount: patchKeys.length });

      // 1) Garantir la base
      await repo.ensureBase();
      logger.debug("persist.ensureBase.ok", { state });

      // 2) Lire l’état courant
      const current = await repo.readSettings(state);
      logger.debug("settings.read", { state });

      // 3) Merge **shallow** sur header (assignDefined) + détection des vraies modifs
      const { next: headerNext, changedKeys } =
        shallowMergeWithChangedKeys<HeaderSettingsDTO>(current.header, patch);

      // No-op → rien à écrire
      if (changedKeys.length === 0) {
        logger.info("ok.noop", { state });
        return { settings: current };
      }

      // 4) Persistance
      const next: SiteSettings = { ...current, header: headerNext };
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
