/**
 * @file src/core/domain/site/entities/primary-menu.ts
 * @intro entité
 */

export interface PrimaryMenuItem {
  label: string;
  href: string;
  newTab: boolean;
}

export interface PrimaryMenuSettings {
  items: Readonly<PrimaryMenuItem[]>;
}
