/**
 * @file src/schemas/site/header/header.ts
 * @intro Schéma Zod pour la configuration du header.
 * @description
 * Source de vérité côté validation/DTO (frontière de **forme**, sans valeurs par défaut).
 * Les valeurs par défaut et la normalisation se gèrent côté domaine/use-cases
 * (ex. `DEFAULT_HEADER_SETTINGS`), pas dans ce schéma.
 * @remarks
 * - `.strict()` est déjà appliqué : toute propriété inconnue est rejetée.
 * @layer schemas
 */

import {
  ContainerWidthSchema,
  HeaderFooterHeightSchema,
} from "@/schemas/site/common";
import { z } from "zod";

/**
 * Schéma de configuration du header (MVP).
 * - `sticky`    : active `position: sticky` en haut.
 * - `blur`      : applique un `backdrop-blur` si support CSS.
 * - `height`    : hauteur visuelle standardisée (sm/md/lg).
 * - `container` : largeur du conteneur interne (full/xl/2xl).
 */
export const HeaderSettingsSchema = z
  .object({
    /** Header collant en haut de page (position: sticky). */
    sticky: z.boolean(),
    /** Flou d’arrière-plan, activé si le navigateur le supporte. */
    blur: z.boolean(),
    /** Hauteur visuelle (pilote typiquement le padding vertical). */
    height: HeaderFooterHeightSchema,
    /** Largeur max du contenu interne (contraint la max-width). */
    container: ContainerWidthSchema,
  })
  .strict();

// Type DTO dérivé du schéma `HeaderSettingsSchema` (source de vérité côté frontière).
