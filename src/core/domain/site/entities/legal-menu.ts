/**
 * @file src/core/domain/site/entities/legal-menu.ts
 * @intro Entité
 */

export interface LegalMenuItem {
  label: string;
  href: string;
  newTab: boolean;
}

export interface LegalMenuSettings {
  items: ReadonlyArray<LegalMenuItem>;
}
