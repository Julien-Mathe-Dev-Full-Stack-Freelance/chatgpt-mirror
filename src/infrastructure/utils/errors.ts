/**
 * @file src/infrastructure/utils/errors.ts
 * @intro Utilitaires pour les erreurs
 */

export const ERRNO = {
  ENOENT: "ENOENT",
  // EEXIST: "EEXIST",
  // EPERM: "EPERM",
} as const;
export type ErrnoCode = (typeof ERRNO)[keyof typeof ERRNO];

// Lecture sûre du code d'erreur
export function nodeErrCode(e: unknown): string | undefined {
  return (e as { code?: unknown })?.code as string | undefined;
}

// Helpers de comparaison
export function isErrno(e: unknown, code: ErrnoCode): boolean {
  return nodeErrCode(e) === code;
}
export const isENOENT = (e: unknown) => isErrno(e, ERRNO.ENOENT);
