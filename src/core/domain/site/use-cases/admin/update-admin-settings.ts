/**
 * @file src/core/domain/site/use-cases/admin/update-admin-settings.ts
 * @intro Use-case : appliquer un patch sur `settings.admin`.
 * @description
 * Charge les réglages, applique un **merge superficiel (shallow)** de `admin` avec le patch,
 * puis persiste. La validation de **forme** reste à la frontière API (Zod).
 *
 * Observabilité :
 * - `info`  : début/fin avec durée
 * - `debug` : étapes clés (ensureBase, lecture, écriture) + clés du patch
 *
 * @remarks
 * - Le merge est **shallow** (clé à clé). Pour des sous-objets imbriqués (ex. `theme`),
 *   un merge profond est à envisager côté use-case/adapters si nécessaire.
 * - `state` par défaut : `"draft"`.
 * @layer domain/use-case
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/core/domain/constants/common";
import type { AdminSettingsDTO } from "@/core/domain/site/dto";
import type { SiteSettings } from "@/core/domain/site/entities/site-settings";
import type {
  UpdateAdminSettingsDeps,
  UpdateAdminSettingsInput,
  UpdateAdminSettingsResult,
} from "@/core/domain/site/use-cases/admin/update-admin-settings.types";
import { log, logWithDuration } from "@/lib/log";
import { shallowMergeWithChangedKeys } from "@/lib/merge";

/**
 * Fabrique le use-case `updateAdminSettings`.
 * @param deps - Dépendances injectées (repository site).
 *   - `repo` : dépôt agrégat site (index/settings).
 * @returns Une fonction `run(input)` qui applique le patch et renvoie `{ settings }`.
 */
export function updateAdminSettings({ repo }: UpdateAdminSettingsDeps) {
  const logger = log.child({ uc: "updateAdminSettings" });

  /**
   * Exécute la mise à jour des réglages Admin.
   * @param input - `{ state?, patch }` (merge **shallow** sur `settings.admin`).
   * @returns `{ settings }` : réglages après écriture.
   */
  return async function run(
    input: UpdateAdminSettingsInput
  ): Promise<UpdateAdminSettingsResult> {
    return logWithDuration("uc.updateAdminSettings", async () => {
      const state: ContentState = input.state ?? DEFAULT_CONTENT_STATE;
      const adminPatch: Partial<AdminSettingsDTO> = input.patch ?? {};
      const patchKeys = Object.keys(adminPatch);

      logger.info("start", { state, patchKeysCount: patchKeys.length });

      // Garantit l’arborescence (content/{state}/settings/…)
      await repo.ensureBase();
      logger.debug("persist.ensureBase.ok", { state });

      // Lire l’état courant
      const current = await repo.readSettings(state);
      logger.debug("settings.read", { state });

      // Fusion non destructive (admin uniquement) — **shallow merge** avec clés modifiées
      const { next: adminNext, changedKeys: adminChanged } =
        shallowMergeWithChangedKeys<AdminSettingsDTO>(
          current.admin,
          adminPatch
        );

      if (adminChanged.length === 0) {
        logger.info("ok.noop", { state });
        return { settings: current };
      }

      const next: SiteSettings = { ...current, admin: adminNext };

      // Persistance
      await repo.writeSettings(state, next);
      logger.debug("settings.written", {
        state,
        adminPatchKeys: patchKeys, // clés modifiées à l’intérieur de admin
        changedKeys: adminChanged,
        changedCount: adminChanged.length,
      });

      logger.info("ok", { state });
      return { settings: next };
    });
  };
}
