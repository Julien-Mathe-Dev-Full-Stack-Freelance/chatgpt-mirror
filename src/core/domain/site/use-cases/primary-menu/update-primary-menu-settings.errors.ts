// /**
//  * @file src/core/domain/site/use-cases/primary-menu/update-primary-menu-settings.errors.ts
//  * @intro Erreurs métier pour `UpdatePrimaryMenuSettings`.
//  * @description
//  * Étend `DomainError` afin d’exposer un `code` stable (`ErrorCode`) pour le mappage API/UI.
//  * Aucune logique métier ici : typage et transport d’informations d’erreur uniquement.
//  * @remarks
//  * - Les codes sont stables (contrat UI/API/analytics).
//  * - Ne pas exposer `details` tel quel à l’UI (contexte technique/loggable seulement).
//  * @layer domain/use-case
//  */

// import { DomainError, isDomainError } from "@/core/domain/errors/domain-error";
// import type { ErrorCode } from "@/core/domain/errors/codes";

// /** Nom stable (sérialisable). */
// export const UPDATE_PRIMARY_MENU_SETTINGS_ERROR_NAME =
//   "UpdatePrimaryMenuSettingsError" as const;

// /** Erreur métier levée lors d’un échec de mise à jour du menu principal. */
// export class UpdatePrimaryMenuSettingsError extends DomainError {
//   constructor(
//     code: ErrorCode,
//     message?: string,
//     details?: unknown,
//     cause?: unknown
//   ) {
//     super({ code, message, details, cause });
//     this.name = UPDATE_PRIMARY_MENU_SETTINGS_ERROR_NAME;
//   }
// }

// export function isUpdatePrimaryMenuSettingsError(
//   err: unknown
// ): err is UpdatePrimaryMenuSettingsError {
//   return (
//     isDomainError(err) && err.name === UPDATE_PRIMARY_MENU_SETTINGS_ERROR_NAME
//   );
// }
