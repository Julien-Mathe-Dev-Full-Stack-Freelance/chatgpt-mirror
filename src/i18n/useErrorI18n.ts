// "use client";

// /**
//  * @file src/i18n/useErrorI18n.ts
//  * @intro Hook i18n pour messages d’erreurs (client)
//  * @layer ui/i18n
//  * @sot docs/bible/ui/i18n-catalogue.md
//  * @remarks
//  * - Hook React → fichier marqué `"use client"`.
//  * - Fallback formalisé via `getErrorMsgSafe` (locale → défaut → errors.generic → fallbackText → dev chevrons / prod vide).
//  */

// import type { ErrorCode } from "@/core/domain/errors/codes";
// import { getErrorMsgSafe } from ".";
// import { useI18n } from "@/i18n/context";

// /**
//  * Expose `tError(code, fallback?)` pour traduire les erreurs côté UI.
//  * - Retourne toujours une chaîne affichable (jamais `undefined`).
//  */
// export function useErrorI18n() {
//   const { locale } = useI18n();

//   return {
//     /**
//      * Traduit un code d’erreur pour la locale courante avec fallback sûr.
//      * @param code Code d’erreur métier typé.
//      * @param fallback Texte alternatif si aucun message n’est trouvé.
//      */
//     tError(code: ErrorCode, fallback?: string): string {
//       return getErrorMsgSafe(locale, code, { fallbackText: fallback });
//     },
//   };
// }
