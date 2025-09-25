/**
 * @file src/core/domain/constants/web.ts
 * @intro Garde-fous web : protocoles HTTP, URLs relatives et emails ASCII.
 * @layer domain/constants
 * @sot docs/bible/domain/constants/web.md
 * @description
 * - Centralise les whitelists liées aux interactions web (HTTP, URLs, emails).
 * - Expose des regex et type-guards simples, réutilisables par domaine/infra.
 * - Garantit des contraintes ASCII prévisibles côté admin et site public.
 * @remarks
 * - Toute extension de whitelist nécessite une revue sécurité/SEO + mise à jour SoT.
 */

/** Protocoles absolus autorisés pour les liens sortants (whitelist stricte). */
export const ABSOLUTE_ALLOWED_PROTOCOLS = ["http:", "https:"] as const;
export type AbsoluteAllowedProtocol =
  (typeof ABSOLUTE_ALLOWED_PROTOCOLS)[number];

/** Vérifie si un protocole absolu appartient à la whitelist HTTP(s). */
export function isAbsoluteHttpProtocol(
  protocol: unknown
): protocol is AbsoluteAllowedProtocol {
  return (
    typeof protocol === "string" &&
    (ABSOLUTE_ALLOWED_PROTOCOLS as readonly string[]).includes(protocol)
  );
}

/**
 * Regex d’URL relative stricte :
 * - Doit commencer par `/`, refuse `//` (protocol-relative) et `\`.
 * - Autorise uniquement les caractères ASCII usuels (`.`, `~`, `?`, `#`, `%`, `+`, `-`).
 */
export const RELATIVE_URL_RE = /^(?:\/(?!\/))[\w\-./~%?#=&+]*$/;

/** Vérifie qu'une chaîne respecte la politique d'URL relative stricte. */
export function isRelativeUrl(input: unknown): input is string {
  return typeof input === "string" && RELATIVE_URL_RE.test(input);
}

/**
 * Regex d’email ASCII simple :
 * - Pas d’internationalisation (compat RFC 6068 `mailto:`).
 * - Format : `local@domaine.tld` avec TLD ≥ 2 caractères.
 */
export const SIMPLE_EMAIL_RE =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/** Vérifie qu'une adresse respecte la variante ASCII simple attendue. */
export function isSimpleEmail(input: unknown): input is string {
  return typeof input === "string" && SIMPLE_EMAIL_RE.test(input);
}
