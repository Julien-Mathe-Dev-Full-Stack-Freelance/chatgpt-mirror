/**
 * @file src/core/domain/site/use-cases/theme/update-theme-settings.ts
 * @intro Use-case : appliquer un patch sur `settings.theme`.
 * @description
 * Charge les réglages, applique un **merge superficiel (shallow)** de `theme` avec le patch,
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
import type { ThemeSettingsDTO } from "@/core/domain/site/dto";
import type { SiteSettings } from "@/core/domain/site/entities/site-settings";
import type {
  UpdateThemeSettingsDeps,
  UpdateThemeSettingsInput,
  UpdateThemeSettingsResult,
} from "@/core/domain/site/use-cases/theme/update-theme-settings.types";
import { log, logWithDuration } from "@/lib/log";
import { shallowMergeWithChangedKeys } from "@/lib/merge";

/**
 * Fabrique le use-case `updateThemeSettings`.
 * @param deps - Dépendances injectées (repository site).
 *   - `repo` : dépôt agrégat site (index/settings).
 * @returns Une fonction `run(input)` qui applique le patch et renvoie `{ settings }`.
 */
export function updateThemeSettings({ repo }: UpdateThemeSettingsDeps) {
  const logger = log.child({ uc: "updateThemeSettings" });

  /**
   * Exécute la mise à jour des réglages Thème.
   * @param input - `{ state?, patch }` (merge **shallow** sur `settings.theme`).
   * @returns `{ settings }` : réglages après écriture.
   */
  return async function run(
    input: UpdateThemeSettingsInput
  ): Promise<UpdateThemeSettingsResult> {
    return logWithDuration("uc.updateThemeSettings", async () => {
      const state: ContentState = input.state ?? DEFAULT_CONTENT_STATE;
      const patch: Partial<ThemeSettingsDTO> = input.patch ?? {};
      const patchKeys = Object.keys(patch);

      logger.info("start", { state, patchKeysCount: patchKeys.length });

      await repo.ensureBase();
      logger.debug("persist.ensureBase.ok", { state });

      const current = await repo.readSettings(state);
      logger.debug("settings.read", { state });

      const { next: themeNext, changedKeys } =
        shallowMergeWithChangedKeys<ThemeSettingsDTO>(current.theme, patch); // ← generic explicite

      if (changedKeys.length === 0) {
        logger.info("ok.noop", { state });
        return { settings: current };
      }

      const next: SiteSettings = { ...current, theme: themeNext };

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
