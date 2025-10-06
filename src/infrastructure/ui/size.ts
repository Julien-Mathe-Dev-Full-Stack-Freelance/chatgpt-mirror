// /**
//  * @file src/infrastructure/ui/size.ts
//  * @intro Adapter UI — mapping HeaderFooterHeight → classes CSS
//  * @layer infra/ui
//  */
// import type { HeaderFooterHeight } from "@/core/domain/constants/theme";

// /** Mapping canonique → classes utilitaires (ajuste selon ton DS). */
// const HEIGHT_CLASS: Record<HeaderFooterHeight, string> = {
//   small: "h-12",
//   medium: "h-16",
//   large: "h-20",
// } as const;

// /** Retourne la classe CSS pour la hauteur header/footer. */
// export function headerFooterHeightClass(kind: HeaderFooterHeight): string {
//   return HEIGHT_CLASS[kind];
// }
