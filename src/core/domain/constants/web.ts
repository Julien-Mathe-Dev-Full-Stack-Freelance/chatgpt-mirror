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

/**
 * Regex d’email ASCII simple :
 * - Pas d’internationalisation (compat RFC 6068 `mailto:`).
 * - Format : `local@domaine.tld` avec TLD ≥ 2 caractères.
 */
const SIMPLE_EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/** Vérifie qu'une adresse respecte la variante ASCII simple attendue. */
export function isSimpleEmail(input: unknown): input is string {
  return typeof input === "string" && SIMPLE_EMAIL_RE.test(input);
}

/** Protocoles absolus autorisés pour les liens sortants (whitelist stricte). */
const ABSOLUTE_ALLOWED_PROTOCOLS = ["http:", "https:"] as const;
type AbsoluteAllowedProtocol = (typeof ABSOLUTE_ALLOWED_PROTOCOLS)[number];

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
const RELATIVE_URL_RE = /^(?:\/(?!\/))[\w\-./~%?#=&+]*$/;

/** Vérifie qu'une chaîne respecte la politique d'URL relative stricte. */
export function isRelativeUrl(input: unknown): input is string {
  return typeof input === "string" && RELATIVE_URL_RE.test(input);
}

/* ────────────────────────── Absolu (dé-duplication) ───────────────────────── */

/** RFC3986: "scheme:" au début (sans valider l’host). */
// const ABSOLUTE_URL_SCHEME_RE = /^[A-Za-z][A-Za-z0-9+.-]*:/;

// /**
//  * Heuristique : vrai si la chaîne *ressemble* à une URL absolue (schéma explicite ou `//`).
//  * ⚠️ Ne garantit pas que ce soit http(s) ni que l’URL soit parseable.
//  * Utile côté API/infra quand on veut préserver la “relativité” d’une URL.
//  */
// export function isAbsoluteUrlLike(input: string): boolean {
//   return ABSOLUTE_URL_SCHEME_RE.test(input) || input.startsWith("//");
// }

/**
 * Vérifie qu’une string est une URL http(s) **valide** avec hostname.
 * (Parse via URL ; filtre par `isAbsoluteHttpProtocol`.)
 * À utiliser en **métier** (validators) et branding fort.
 */
export function isAbsoluteHttpUrlStrict(input: string): boolean {
  try {
    const u = new URL(input);
    return isAbsoluteHttpProtocol(u.protocol) && !!u.hostname;
  } catch {
    return false;
  }
}
