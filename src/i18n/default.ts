/**
 * @file src/i18n/default.ts
 * @intro i18n — translateur statique (locale par défaut)
 * @description
 * Fournit un `t` prêt à l’emploi reposant sur la `DEFAULT_LOCALE`.
 * Utile dans les modules partagés (schemas, constantes) qui ne peuvent
 * pas dépendre de l’environnement Next/Request.
 */

import {
  DEFAULT_LOCALE,
  MESSAGES,
  createTSafe,
  type TFunc,
} from "@/i18n";

export const defaultT: TFunc = createTSafe(
  MESSAGES[DEFAULT_LOCALE],
  MESSAGES[DEFAULT_LOCALE]
);

