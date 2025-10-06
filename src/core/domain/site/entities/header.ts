/**
 * @file src/core/domain/site/entities/header.ts
 * @intro Entité métier — HeaderSettings (V0.5)
 * @description
 * Représentation **métier pure** des réglages de header pour l’admin V0.5.
 * Portée validée (options fonctionnelles uniquement, sans design avancé) :
 * - `showLogo` : afficher le logo.
 * - `showTitle` : afficher le titre.
 * - `sticky` : header collant (position sticky).
 * - `blur` : flou d’arrière-plan.
 * - `swapPrimaryAndSocial` : inverser l’ordre des zones (navigation ↔ social).
 *
 * Hors scope V0.5 (retiré de l’entité) :
 * - `height`, `container` (options de design/tailles non gérées ici).
 *
 * Rappels :
 * - Aucune I/O ni logique de persistance dans l’entité.
 * - L’immutabilité est gérée par les defaults (deepFreeze) et par les DTO Readonly<...>,
 *   pas via `readonly` sur l’entité pour permettre les adaptations côté adapters/use-cases.
 *
 * @layer domain/entity
 */

export interface HeaderSettings {
  /** Afficher le logo dans le header. */
  showLogo: boolean;
  /** Afficher le titre du site dans le header. */
  showTitle: boolean;
  /** Rendre le header collant en haut de page. */
  sticky: boolean;
  /** Activer un effet de flou d’arrière-plan. */
  blur: boolean;
  /**
   * Inverser l’ordre des zones : navigation principale ↔ liens sociaux.
   * Permet une variante simple sans introduire d’options de design.
   */
  swapPrimaryAndSocial: boolean;
}
