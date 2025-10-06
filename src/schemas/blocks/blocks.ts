// /**
//  * @file src/schemas/blocks/blocks.ts
//  * @intro Schémas Zod des blocs de page (union discriminée + versionnage)
//  * @description
//  * - Union discriminée par `type`.
//  * - Chaque bloc porte `version` = 1 (prêt pour migrations futures).
//  * - Base commune minimaliste (id?).
//  * @layer schemas/blocks
//  */

// import { BLOCK_TYPES } from "@/core/domain/blocks/constants";
// import {
//   IMAGE_ALT_MAX,
//   IMAGE_ALT_MIN,
//   IMAGE_CAPTION_MAX,
//   IMAGE_CAPTION_MIN,
//   TEXT_BLOCK_CONTENT_MAX,
//   TEXT_BLOCK_CONTENT_MIN,
// } from "@/core/domain/constants/limits";
// import { BlockIdTools } from "@/core/domain/ids/tools";
// import { defaultT } from "@/i18n/default";
// import { nonEmptyTrimmedString } from "@/schemas/builders";
// import { AssetUrlSchema } from "@/schemas/shared/url-fragments";
// import { z } from "zod";

// const BLOCK_ID_REGEX = new RegExp(
//   `^${BlockIdTools.prefix}[A-Za-z0-9_-]{${BlockIdTools.size}}$`
// );

// const t = defaultT;

// /** Base commune minimale de chaque bloc. */
// const BlockBaseSchema = z
//   .object({
//     /** Identifiant local facultatif (ex. pour le diff UI). */
//     id: z
//       .string()
//       .trim()
//       .refine((value) => BLOCK_ID_REGEX.test(value), {
//         message: t("validation.id.invalid"),
//       })
//       .optional(),
//   })
//   .strict();

// /** Bloc texte. */
// export const TextBlockSchema = BlockBaseSchema.extend({
//   type: z.literal(BLOCK_TYPES.TEXT),
//   content: nonEmptyTrimmedString(
//     TEXT_BLOCK_CONTENT_MIN,
//     TEXT_BLOCK_CONTENT_MAX
//   ),
//   align: z.enum(H_ALIGNMENTS).optional(),
// }).strict();

// /** Bloc image. */
// export const ImageBlockSchema = BlockBaseSchema.extend({
//   type: z.literal(BLOCK_TYPES.IMAGE),
//   src: AssetUrlSchema,
//   alt: nonEmptyTrimmedString(IMAGE_ALT_MIN, IMAGE_ALT_MAX).optional(),
//   caption: nonEmptyTrimmedString(
//     IMAGE_CAPTION_MIN,
//     IMAGE_CAPTION_MAX
//   ).optional(),
//   width: z.number().int().positive().optional(),
//   height: z.number().int().positive().optional(),
// }).strict();

// /** Union discriminée des blocs supportés. */
// export const BlockSchema = z.discriminatedUnion("type", [
//   TextBlockSchema,
//   ImageBlockSchema,
// ]);
