/**
 * @file src/core/domain/site/use-cases/footer/update-footer-settings.ts
 * @intro Use-case : appliquer un patch sur `settings.footer`.
 * @description
 * Charge les réglages, applique un **merge superficiel (shallow)** de `footer` avec le patch,
 * puis persiste. La validation de **forme** reste à la frontière API (Zod).
 *
 * Observabilité :
 * - info  : début/fin avec durée
 * - debug : étapes clés (ensureBase, lecture, écriture) + clés du patch
 *
 * @remarks
 * - Le merge est **shallow** (clé à clé). Si des sous-objets apparaissent plus tard,
 *   envisager un merge profond ciblé côté use-case/adapters.
 * - state par défaut : "draft".
 * @layer domain/use-case
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/core/domain/constants/common";
import type { FooterSettings } from "@/core/domain/site/entities";
import type { SiteSettings } from "@/core/domain/site/entities/site-settings";
import type {
  UpdateFooterSettingsDeps,
  UpdateFooterSettingsInput,
  UpdateFooterSettingsResult,
} from "@/core/domain/site/use-cases/footer/update-footer-settings.types";
import { log, logWithDuration } from "@/lib/log";
import { shallowMergeWithChangedKeys } from "@/lib/merge";

/**
 * Fabrique le use-case `updateFooterSettings`.
 * @param deps - Dépendances injectées (repository site).
 * @returns Une fonction `run(input)` qui applique le patch et renvoie `{ settings }`.
 */
export function updateFooterSettings({ repo }: UpdateFooterSettingsDeps) {
  const logger = log.child({ uc: "updateFooterSettings" });

  /**
   * Exécute la mise à jour des réglages Footer.
   * @param input - `{ state?, patch }` (merge **shallow** sur `settings.footer`).
   * @returns `{ settings }` : réglages après écriture.
   */
  return async function run(
    input: UpdateFooterSettingsInput
  ): Promise<UpdateFooterSettingsResult> {
    return logWithDuration("uc.updateFooterSettings", async () => {
      const state: ContentState = input.state ?? DEFAULT_CONTENT_STATE;
      const patch: Partial<FooterSettings> = input.patch ?? {};
      const patchKeys = Object.keys(patch);

      logger.info("start", { state, patchKeysCount: patchKeys.length });

      await repo.ensureBase();
      logger.debug("persist.ensureBase.ok", { state });

      const current = await repo.readSettings(state);
      logger.debug("settings.read", { state });

      const { next: footerNext, changedKeys } =
        shallowMergeWithChangedKeys<FooterSettings>(current.footer, patch);

      if (changedKeys.length === 0) {
        logger.info("ok.noop", { state });
        return { settings: current };
      }

      const next: SiteSettings = { ...current, footer: footerNext };
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
