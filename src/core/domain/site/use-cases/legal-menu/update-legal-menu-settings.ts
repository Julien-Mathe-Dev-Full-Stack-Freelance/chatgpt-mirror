/**
 * @file src/core/domain/site/use-cases/legal-menu/update-legal-menu-settings.ts
 * @intro Use-case : appliquer un patch sur `settings.legalMenu`.
 * @description
 * Charge les réglages, applique un **merge superficiel (shallow)** de `legalMenu` avec le patch,
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
import type { LegalMenuSettingsDTO } from "@/core/domain/site/dto";
import type { SiteSettings } from "@/core/domain/site/entities/site-settings";
import type {
  UpdateLegalMenuSettingsDeps,
  UpdateLegalMenuSettingsInput,
  UpdateLegalMenuSettingsResult,
} from "@/core/domain/site/use-cases/legal-menu/update-legal-menu-settings.types";
import { log, logWithDuration } from "@/lib/log";
import { shallowMergeWithChangedKeys } from "@/lib/merge";

export function updateLegalMenuSettings({ repo }: UpdateLegalMenuSettingsDeps) {
  const logger = log.child({ uc: "updateLegalMenuSettings" });

  return async function run(
    input: UpdateLegalMenuSettingsInput
  ): Promise<UpdateLegalMenuSettingsResult> {
    return logWithDuration("uc.updateLegalMenuSettings", async () => {
      const state: ContentState = input.state ?? DEFAULT_CONTENT_STATE;
      const patch: Partial<LegalMenuSettingsDTO> = input.patch ?? {};
      const patchKeys = Object.keys(patch);

      logger.info("start", { state, patchKeysCount: patchKeys.length });

      await repo.ensureBase();
      logger.debug("persist.ensureBase.ok", { state });

      const current = await repo.readSettings(state);
      logger.debug("settings.read", { state });

      const { next: legalMenuNext, changedKeys } =
        shallowMergeWithChangedKeys<LegalMenuSettingsDTO>(
          current.legalMenu,
          patch
        );

      if (changedKeys.length === 0) {
        logger.info("ok.noop", { state });
        return { settings: current };
      }

      const next: SiteSettings = { ...current, legalMenu: legalMenuNext };
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
