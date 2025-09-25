/**
 * @file src/core/domain/site/entities/footer.ts
 * @intro DTO de réglages du footer (logo, hauteur, conteneur, copyright)
 */

import type {
  ContainerKey,
  HeaderFooterHeight,
} from "@/core/domain/constants/theme";

export interface FooterSettings {
  height: HeaderFooterHeight;
  container: ContainerKey;
  copyright?: string;
  copyrightShowYear?: boolean;
}
