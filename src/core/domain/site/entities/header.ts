/**
 * @file src/core/domain/site/entities/header.ts
 * @intro DTO de réglages de header (sticky, blur, hauteur, conteneur)
 */

import type {
  ContainerKey,
  HeaderFooterHeight,
} from "@/core/domain/constants/theme";

export interface HeaderSettings {
  sticky: boolean;
  blur: boolean;
  height: HeaderFooterHeight;
  container: ContainerKey;
}
