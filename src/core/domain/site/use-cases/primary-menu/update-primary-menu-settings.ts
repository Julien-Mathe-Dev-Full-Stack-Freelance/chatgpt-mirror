/**
 * @file src/core/domain/site/use-cases/primary-menu/update-primary-menu-settings.ts
 * @intro Use-case : appliquer un patch sur `settings.primaryMenu`.
 * @description
 * Merge **shallow** + persist uniquement. La validation de **forme** reste à la
 * frontière API (Zod). Les warnings (doublons) sont gérés en UI.
 *
 * Observabilité :
 * - `info`  : début/fin avec durée
 * - `debug` : ensureBase, lecture, écriture + clés du patch
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/core/domain/constants/common";
import type { PrimaryMenuSettingsDTO } from "@/core/domain/site/dto";
import type { SiteSettings } from "@/core/domain/site/entities/site-settings";
import type {
  UpdatePrimaryMenuSettingsDeps,
  UpdatePrimaryMenuSettingsInput,
  UpdatePrimaryMenuSettingsResult,
} from "@/core/domain/site/use-cases/primary-menu/update-primary-menu-settings.types";
import { log, logWithDuration } from "@/lib/log";
import { shallowMergeWithChangedKeys } from "@/lib/merge";

export function updatePrimaryMenuSettings({
  repo,
}: UpdatePrimaryMenuSettingsDeps) {
  const logger = log.child({ uc: "updatePrimaryMenuSettings" });

  return async function run(
    input: UpdatePrimaryMenuSettingsInput
  ): Promise<UpdatePrimaryMenuSettingsResult> {
    return logWithDuration("uc.updatePrimaryMenuSettings", async () => {
      const state: ContentState = input.state ?? DEFAULT_CONTENT_STATE;
      const patch: Partial<PrimaryMenuSettingsDTO> = input.patch ?? {};
      const patchKeys = Object.keys(patch);

      logger.info("start", { state, patchKeysCount: patchKeys.length });

      await repo.ensureBase();
      logger.debug("persist.ensureBase.ok", { state });

      const current = await repo.readSettings(state);
      logger.debug("settings.read", { state });

      const { next: menuNext, changedKeys } =
        shallowMergeWithChangedKeys<PrimaryMenuSettingsDTO>(
          current.primaryMenu,
          patch
        );

      if (changedKeys.length === 0) {
        logger.info("ok.noop", { state });
        return { settings: current };
      }

      const next: SiteSettings = { ...current, primaryMenu: menuNext };
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
