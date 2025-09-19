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
import { UpdateLegalMenuSettingsError } from "@/core/domain/site/use-cases/legal-menu/update-legal-menu-settings.errors";
import type {
  UpdateLegalMenuSettingsDeps,
  UpdateLegalMenuSettingsInput,
  UpdateLegalMenuSettingsResult,
} from "@/core/domain/site/use-cases/legal-menu/update-legal-menu-settings.types";
import { checkLegalMenuRules } from "@/core/domain/site/validators/legal-menu";
import { log, logWithDuration } from "@/lib/log";
import { shallowMergeWithChangedKeys } from "@/lib/merge";

/**
 * Fabrique le use-case `updateLegalMenuSettings`.
 * @param deps - Dépendances injectées (repository site).
 *   - `repo` : dépôt agrégat site (index/settings).
 * @returns Une fonction `run(input)` qui applique le patch et renvoie `{ settings }`.
 */
export function updateLegalMenuSettings({ repo }: UpdateLegalMenuSettingsDeps) {
  const logger = log.child({ uc: "updateLegalMenuSettings" });

  /**
   * Exécute la mise à jour des réglages Legal Menu.
   * @param input - `{ state?, patch }` (merge **shallow** sur `settings.legalMenu`).
   * @returns `{ settings }` : réglages après écriture.
   */
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

      // Règles métier (labels/hrefs requis) sur l’état final
      const ruleIssues = checkLegalMenuRules(legalMenuNext);
      if (ruleIssues.length > 0) {
        logger.warn("legalMenu.rules.failed", { issues: ruleIssues }); // observabilité
        throw new UpdateLegalMenuSettingsError(ruleIssues[0].code);
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
