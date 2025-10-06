/**
 * @file src/app/api/admin/_adapters/menus.ts
 * @intro Adapters API → Domaine pour les menus (primary + legal)
 */

import type {
  LegalMenuItem,
  LegalMenuSettings,
} from "@/core/domain/site/entities/legal-menu";
import type {
  PrimaryMenuItem,
  PrimaryMenuSettings,
} from "@/core/domain/site/entities/primary-menu";
import { asAssetUrl, isAbsoluteAssetUrl } from "@/core/domain/urls/tools";

import type { UpdateLegalMenuSettingsPatchDTO } from "@/schemas/site/legal-menu/legal-menu-intents";
import type { UpdatePrimaryMenuSettingsPatchDTO } from "@/schemas/site/primary-menu/primary-menu-intents";

/* ─────────── LEGAL ─────────── */

function adaptLegalItem(dto: {
  label: string;
  href: string;
  newTab: boolean;
}): LegalMenuItem {
  const href = asAssetUrl(dto.href);
  return {
    label: dto.label.trim(),
    href,
    newTab: !!dto.newTab,
    isExternal: isAbsoluteAssetUrl(href), // dérivé serveur
  };
}

export function adaptUpdateLegalMenuPatch(
  dto: UpdateLegalMenuSettingsPatchDTO
): Partial<LegalMenuSettings> {
  const out: Partial<LegalMenuSettings> = {};
  if (Array.isArray(dto.items)) {
    out.items = dto.items.map(adaptLegalItem);
  }
  return out;
}

/* ─────────── PRIMARY (2 niveaux max) ─────────── */

function adaptPrimaryChild(dto: {
  label: string;
  href: string;
  newTab: boolean;
}): PrimaryMenuItem {
  const href = asAssetUrl(dto.href);
  return {
    label: dto.label.trim(),
    href,
    newTab: !!dto.newTab,
    isExternal: isAbsoluteAssetUrl(href),
    children: [],
  };
}

function adaptPrimaryItem(dto: {
  label: string;
  href: string;
  newTab: boolean;
  children?: Array<{ label: string; href: string; newTab: boolean }>;
}): PrimaryMenuItem {
  const href = asAssetUrl(dto.href);
  const base: PrimaryMenuItem = {
    label: dto.label.trim(),
    href,
    newTab: !!dto.newTab,
    isExternal: isAbsoluteAssetUrl(href),
    children: [],
  };

  if (Array.isArray(dto.children) && dto.children.length > 0) {
    const kids = dto.children.map(adaptPrimaryChild);
    return { ...base, children: kids };
  }
  return base;
}

export function adaptUpdatePrimaryMenuPatch(
  dto: UpdatePrimaryMenuSettingsPatchDTO
): Partial<PrimaryMenuSettings> {
  const out: Partial<PrimaryMenuSettings> = {};
  if (Array.isArray(dto.items)) {
    out.items = dto.items.map(adaptPrimaryItem);
  }
  return out;
}
