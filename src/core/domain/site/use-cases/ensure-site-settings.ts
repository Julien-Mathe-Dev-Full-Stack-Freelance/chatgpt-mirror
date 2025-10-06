/**
 * @file src/core/domain/site/use-cases/ensure-site-settings.ts
 * @intro Use-cases — “ensure” settings (seed-once at first read)
 * @layer core/domain
 *
 * Principe:
 * - On lit via repo.findX(state).
 * - Si inexistant -> on persiste un SEED fourni par le caller (UI/route) puis on le retourne.
 * - Si existant -> on retourne tel quel (aucun reseed).
 *
 * Nota:
 * - Le seed peut être localisé (passé depuis la route via i18n).
 * - Les entités/DTO sont du domaine (SoT).
 */

import type { ContentState } from "@/constants/shared/common";
import type {
  FooterSettings,
  HeaderSettings,
  IdentitySettings,
  LegalMenuSettings,
  PrimaryMenuSettings,
  SeoSettings,
  SocialSettings,
} from "@/core/domain/site/entities";

// Interfaces minimalistes des repos (adapter infra)
export interface IdentitySettingsRepo {
  find(state: ContentState): Promise<IdentitySettings | null>;
  save(next: IdentitySettings, state: ContentState): Promise<void>;
}

export interface LegalMenuSettingsRepo {
  find(state: ContentState): Promise<LegalMenuSettings | null>;
  save(next: LegalMenuSettings, state: ContentState): Promise<void>;
}

export interface PrimaryMenuSettingsRepo {
  find(state: ContentState): Promise<PrimaryMenuSettings | null>;
  save(next: PrimaryMenuSettings, state: ContentState): Promise<void>;
}

export interface SocialSettingsRepo {
  find(state: ContentState): Promise<SocialSettings | null>;
  save(next: SocialSettings, state: ContentState): Promise<void>;
}

export interface HeaderSettingsRepo {
  find(state: ContentState): Promise<HeaderSettings | null>;
  save(next: HeaderSettings, state: ContentState): Promise<void>;
}

export interface FooterSettingsRepo {
  find(state: ContentState): Promise<FooterSettings | null>;
  save(next: FooterSettings, state: ContentState): Promise<void>;
}

export interface SeoSettingsRepo {
  find(state: ContentState): Promise<SeoSettings | null>;
  save(next: SeoSettings, state: ContentState): Promise<void>;
}

/** Ensure — Identity */
export async function ensureIdentitySettings(
  repo: IdentitySettingsRepo,
  seed: IdentitySettings,
  state: ContentState
): Promise<IdentitySettings> {
  const current = await repo.find(state);
  if (current) return current;
  await repo.save(seed, state);
  return seed;
}

/** Ensure — Legal menu */
export async function ensureLegalMenuSettings(
  repo: LegalMenuSettingsRepo,
  seed: LegalMenuSettings,
  state: ContentState
): Promise<LegalMenuSettings> {
  const current = await repo.find(state);
  if (current) return current;
  await repo.save(seed, state);
  return seed;
}

/** Ensure — Primary menu */
export async function ensurePrimaryMenuSettings(
  repo: PrimaryMenuSettingsRepo,
  seed: PrimaryMenuSettings,
  state: ContentState
): Promise<PrimaryMenuSettings> {
  const current = await repo.find(state);
  if (current) return current;
  await repo.save(seed, state);
  return seed;
}

/** Ensure — Social */
export async function ensureSocialSettings(
  repo: SocialSettingsRepo,
  seed: SocialSettings,
  state: ContentState
): Promise<SocialSettings> {
  const current = await repo.find(state);
  if (current) return current;
  await repo.save(seed, state);
  return seed;
}

/** Ensure — Header */
export async function ensureHeaderSettings(
  repo: HeaderSettingsRepo,
  seed: HeaderSettings,
  state: ContentState
): Promise<HeaderSettings> {
  const current = await repo.find(state);
  if (current) return current;
  await repo.save(seed, state);
  return seed;
}

/** Ensure — Footer */
export async function ensureFooterSettings(
  repo: FooterSettingsRepo,
  seed: FooterSettings,
  state: ContentState
): Promise<FooterSettings> {
  const current = await repo.find(state);
  if (current) return current;
  await repo.save(seed, state);
  return seed;
}

/** Ensure — SEO */
export async function ensureSeoSettings(
  repo: SeoSettingsRepo,
  seed: SeoSettings,
  state: ContentState
): Promise<SeoSettings> {
  const current = await repo.find(state);
  if (current) return current;
  await repo.save(seed, state);
  return seed;
}
