/**
 * @file src/core/domain/urls/tools.ts
 * @intro Barrel public des helpers URLs (href, mailto, compare)
 * @layer domain/utils
 * @remarks
 * - Point d'entrée canonique pour importer des outils URLs dans tout le projet.
 * - Evite les imports multi-fichiers dans les couches supérieures.
 */

export * from "@/core/domain/urls/compare";
export * from "@/core/domain/urls/derive";
export * from "@/core/domain/urls/formats";
export * from "@/core/domain/urls/href";
export * from "@/core/domain/urls/mailto";
