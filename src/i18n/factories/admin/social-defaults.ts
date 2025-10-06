/**
 * @file src/i18n/factories/admin/social-defaults.ts
 * @intro i18n — factories admin (social)
 *
 * But : fournir un seed *localisé* pour l’affichage quand l’objet est vide.
 * Ce seed n’est PAS persisté tant que l’utilisateur n’enregistre pas.
 * (seed-once assuré par ensureSocialSettings côté route GET)
 */

import { buildSocialItem } from "@/core/domain/site/defaults/social";
import type { SocialSettings } from "@/core/domain/site/entities/social";
import type { TFunc } from "@/i18n";

/**
 * Seed minimal & sûr : liste vide.
 * Si tu veux proposer des exemples localisés (ex. "Votre e-mail", "Votre Instagram"),
 * tu peux les injecter ici plus tard (toujours safe par défaut).
 */
export function makeLocalizedSocialDefaults(_t: TFunc): SocialSettings {
  return { items: [buildSocialItem("instagram", "https://instagram.com")] };
}
