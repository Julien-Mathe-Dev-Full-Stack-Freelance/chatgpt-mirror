// src/schemas/routes/params.ts
/**
 * @file src/schemas/routes/params.ts
 * @intro Schémas Zod pour les paramètres de routes (frontière API)
 * @layer schemas
 * @remarks
 * - Forme uniquement (aucune logique métier ici).
 * - Évite la redéfinition locale `{ slug: SlugSchema }` dans chaque route.
 */

import { z } from "zod";
import { SlugSchema } from "@/schemas/pages/page";

export const SlugParamSchema = z.object({ slug: SlugSchema }).strict();

// Ajoute d'autres enveloppes au besoin (exemples) :
// export const IdParamSchema = z.object({ id: z.string().uuid() }).strict();
// export type IdParam = z.infer<typeof IdParamSchema>;
