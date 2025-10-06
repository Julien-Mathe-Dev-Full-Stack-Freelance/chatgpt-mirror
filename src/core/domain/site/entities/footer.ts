/**
 * @file src/core/domain/site/entities/footer.ts
 * @intro DTO de réglages du footer (logo, hauteur, conteneur, copyright)
 */

export interface FooterSettings {
  copyright: string;
  showYear: boolean;
}
