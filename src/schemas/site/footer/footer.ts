/**
 * @file src/schemas/site/footer/footer.ts
 * @intro Schéma Zod pour la configuration du footer.
 * @description
 * Source de vérité côté validation/DTO (frontière de forme).
 * Par principe, les valeurs par défaut sont gérées côté domaine
 * (ex. `DEFAULT_FOOTER_SETTINGS`) ou dans les use-cases/adapters.
 * @remarks
 * - Une valeur par défaut est toutefois appliquée ici à `copyrightShowYear`
 *   à titre pragmatique (peut être déplacée côté domaine ultérieurement).
 * - `.strict()` pourrait être activé si l’on souhaite refuser les propriétés
 *   inconnues (changement potentiellement breaking).
 * @layer schemas
 */

import {
  FOOTER_COPYRIGHT_MAX,
  FOOTER_COPYRIGHT_MIN,
} from "@/core/domain/constants/limits";
import { nonEmptyTrimmedString } from "@/schemas/builders";
import { AssetUrlSchema } from "@/schemas/shared/url-fragments";
import {
  ContainerWidthSchema,
  HeaderFooterHeightSchema,
} from "@/schemas/site/common";
import { z } from "zod";

/**
 * Schéma de configuration du footer (MVP).
 * - `logoUrl`           : URL absolue/relative du logo (optionnel).
 * - `height`            : hauteur visuelle (sm/md/lg) → pilote le padding vertical.
 * - `container`         : largeur du conteneur interne (full/xl/2xl).
 * - `copyrightShowYear` : afficher l’année dans le footer.
 * - `copyrightText`     : texte optionnel affiché en bas de page.
 */
export const FooterSettingsSchema = z
  .object({
    /** URL de l’actif logo ; accepte absolu et relatif. */
    logoUrl: AssetUrlSchema.optional(),
    /** Hauteur visuelle standardisée (impacte le padding vertical). */
    height: HeaderFooterHeightSchema,
    /** Largeur du conteneur interne (contraint la max-width). */
    container: ContainerWidthSchema,
    /** Affichage de l’année — défaut pragmatique côté schéma (voir @remarks). */
    copyrightShowYear: z.boolean(),
    /** Texte libre (trimé), longueur bornée pour préserver la lisibilité. */
    copyrightText: nonEmptyTrimmedString(
      FOOTER_COPYRIGHT_MIN,
      FOOTER_COPYRIGHT_MAX,
      {
        tooShort: "validation.text.tooShort",
        tooLong: "validation.text.tooLong",
      }
    ).optional(),
  })
  .strict();
