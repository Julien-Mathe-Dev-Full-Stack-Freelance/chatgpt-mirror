/**
 * @file src/core/domain/constants/web.ts
 * @intro Garde-fous web : protocoles HTTP, URLs relatives et emails ASCII.
 * @layer domain/constants
 * @sot docs/bible/domain/constants/web.md
 * @description
 * - Centralise les whitelists liées aux interactions web (HTTP & email).
 * - Fournit des gardes simples réutilisables par le domaine et l'infra.
 * - Préserve des contraintes ASCII prévisibles côté admin et site public.
 * @remarks Élargir une whitelist nécessite une revue sécurité/SEO + MAJ SoT.
 */

/** Protocoles absolus autorisés pour les liens sortants (whitelist stricte). */
export const ABSOLUTE_ALLOWED_PROTOCOLS = ["http:", "https:"] as const;
export type AbsoluteAllowedProtocol =
  (typeof ABSOLUTE_ALLOWED_PROTOCOLS)[number];

/**
 * Vérifie si un protocole absolu appartient à la whitelist HTTP(s).
 * @returns `true` si le protocole est `http:` ou `https:`.
 */
export function isAbsoluteHttpProtocol(
  protocol: string
): protocol is AbsoluteAllowedProtocol {
  return (ABSOLUTE_ALLOWED_PROTOCOLS as readonly string[]).includes(protocol);
}

/**
 * URL relative stricte : commence par `/`, refuse `//` (protocol-relative) et `\`.
 * - Autorise les caractères ASCII usuels (`.`, `~`, `?`, `#`, `%`, `+`, `-`).
 */
export const RELATIVE_URL_RE = /^(?:\/(?!\/))[\w\-./~%?#=&+]*$/;

/** Vérifie qu'une chaîne respecte la politique d'URL relative stricte. */
export function isRelativeUrl(input: string): boolean {
  return RELATIVE_URL_RE.test(input);
}

/** Email ASCII simple (sans internationalisation, compatible mailto RFC 6068). */
export const SIMPLE_EMAIL_RE =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/** Vérifie qu'une adresse respecte la variante ASCII simple attendue. */
export function isSimpleEmail(input: string): boolean {
  return SIMPLE_EMAIL_RE.test(input);
}
