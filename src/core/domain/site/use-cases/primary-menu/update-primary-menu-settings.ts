/**
 * @file src/core/domain/site/use-cases/primary-menu/update-primary-menu-settings.ts
 * @intro Use-case : appliquer un patch sur `settings.menu`.
 * @description
 * Charge les réglages, applique un **merge superficiel (shallow)** de `menu` avec le patch,
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
import type { PrimaryMenuSettingsDTO } from "@/core/domain/site/dto";
import type { SiteSettings } from "@/core/domain/site/entities/site-settings";
import { UpdatePrimaryMenuSettingsError } from "@/core/domain/site/use-cases/primary-menu/update-primary-menu-settings.errors";
import type {
  UpdatePrimaryMenuSettingsDeps,
  UpdatePrimaryMenuSettingsInput,
  UpdatePrimaryMenuSettingsResult,
} from "@/core/domain/site/use-cases/primary-menu/update-primary-menu-settings.types";
import {
  checkPrimaryMenuRules,
  findPrimaryMenuWarnings,
} from "@/core/domain/site/validators/primary-menu";
import { log, logWithDuration } from "@/lib/log";
import { shallowMergeWithChangedKeys } from "@/lib/merge";

/**
 * Fabrique le use-case `updatePrimaryMenuSettings`.
 * @param deps - Dépendances injectées (repository site).
 *   - `repo` : dépôt agrégat site (index/settings).
 * @returns Une fonction `run(input)` qui applique le patch et renvoie `{ settings }`.
 */
export function updatePrimaryMenuSettings({
  repo,
}: UpdatePrimaryMenuSettingsDeps) {
  const logger = log.child({ uc: "updatePrimaryMenuSettings" });

  /**
   * Exécute la mise à jour des réglages du menu principal.
   * @param input - `{ state?, patch }` (merge **shallow** sur `settings.menu`).
   * @returns `{ settings }` : réglages après écriture.
   */
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

      // Règles bloquantes
      const issues = checkPrimaryMenuRules(menuNext);
      if (issues.length > 0) {
        logger.warn("menu.rules.failed", { issues });
        // on remonte juste le 1er code (UI peut afficher champs ciblés via `path` si besoin)
        throw new UpdatePrimaryMenuSettingsError(issues[0].code);
      }

      // Warnings non bloquants (doublons) — loggés pour observabilité
      const warnings = findPrimaryMenuWarnings(menuNext.items);
      const duplicateLabels = warnings.filter(
        (w) => w.code === "DUPLICATE_LABEL"
      );
      const duplicateHrefs = warnings.filter(
        (w) => w.code === "DUPLICATE_HREF"
      );
      if (duplicateLabels.length > 0 || duplicateHrefs.length > 0) {
        logger.warn("menu.warnings", { duplicateLabels, duplicateHrefs });
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
