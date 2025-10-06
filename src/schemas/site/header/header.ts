/**
 * @file src/schemas/site/header/header.ts
 * @intro Schéma Zod pour la configuration du header (V0.5)
 * @description
 * Source de vérité côté validation/DTO (frontière de **forme**, sans valeurs par défaut**).
 * Les valeurs par défaut et la normalisation se gèrent côté domaine/use-cases
 * (ex. `DEFAULT_HEADER_SETTINGS`), pas dans ce schéma.
 * @remarks
 * - `.strict()` est appliqué : toute propriété inconnue est rejetée.
 * - Portée V0.5 : showLogo, showTitle, sticky, blur, swapPrimaryAndSocial.
 * @layer schemas
 */

import { z } from "zod";

/**
 * Schéma de configuration du header (V0.5).
 * - `showLogo`             : affiche le logo.
 * - `showTitle`            : affiche le titre.
 * - `sticky`               : active `position: sticky` en haut.
 * - `blur`                 : applique un `backdrop-blur` si support CSS.
 * - `swapPrimaryAndSocial` : inverse l’ordre (navigation ↔ social).
 */
export const HeaderSettingsSchema = z
  .object({
    /** Afficher le logo dans le header. */
    showLogo: z.boolean(),
    /** Afficher le titre du site dans le header. */
    showTitle: z.boolean(),
    /** Header collant en haut de page (position: sticky). */
    sticky: z.boolean(),
    /** Flou d’arrière-plan, activé si le navigateur le supporte. */
    blur: z.boolean(),
    /**
     * Inversion des zones : navigation principale ↔ liens sociaux.
     * Variante simple sans options de design.
     */
    swapPrimaryAndSocial: z.boolean(),
  })
  .strict();

/** Type DTO dérivé du schéma `HeaderSettingsSchema` (frontière). */
export type HeaderSettingsInput = z.input<typeof HeaderSettingsSchema>;
