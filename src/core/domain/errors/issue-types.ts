/**
 * @file src/core/domain/errors/issue-types.ts
 * @intro Types d’issues remontées au-dessus des use-cases (blocking vs UI warning).
 * @layer domain/errors
 * @sot docs/bible/domain/errors/README.md#issue-types
 * @description
 * - `BlockingIssue` : erreur **bloquante** indexée sur un `ErrorCode` (métier).
 * - `UiWarning<C>` : **avertissement UI** (non bloquant) avec codes **locaux** (non `ErrorCode`).
 * - `IssuePath` : chemin vers le champ/segment incriminé (ex. `["menu", 0, "href"]`).
 * @remarks
 * - Les `UiWarning` ne doivent pas être exposés comme des erreurs HTTP ; ils guident l’édition.
 */

import type { ErrorCode } from "@/core/domain/errors/codes";

/** Chemin vers le champ/segment incriminé (ex. ["menu", 0, "href"]). */
type IssuePath = ReadonlyArray<string | number>;

/** Erreur bloquante (métier) : s’appuie sur un `ErrorCode`. */
export type BlockingIssue = Readonly<{
  code: ErrorCode;
  path: IssuePath;
  meta?: Record<string, unknown>;
}>;

/** Avertissement UI (non bloquant) : codes locaux, pas des `ErrorCode`. */
export type UiWarning<C extends string = string> = Readonly<{
  code: C; // codes locaux, non ErrorCode
  path?: IssuePath; // souvent pas nécessaire
  meta?: Record<string, unknown>;
}>;
