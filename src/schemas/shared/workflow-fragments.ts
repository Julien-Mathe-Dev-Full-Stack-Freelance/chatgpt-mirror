/**
 * @file src/schemas/shared/workflow-fragments.ts
 * @intro Schémas de validation des fragments de workflow.
 */
import { CONTENT_STATES } from "@/constants/shared/common";
import { z } from "zod";

/**
 * Espace logique de contenu (workflow de publication).
 * - draft     : brouillon (édition en cours)
 * - published : version publiée (runtime public)
 */
export const ContentStateSchema = z.enum(CONTENT_STATES);
