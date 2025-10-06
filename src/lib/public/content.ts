/**
 * @file src/lib/public/content.ts
 * @intro Helpers serveur pour lire le contenu « published »
 * @description
 * Lit les settings, l’index et une page depuis `/content/published`.
 * Implémentation volontairement minimale (pas de Zod pour le MVP).
 *
 * Observabilité :
 * - Aucune (helpers purs sans logs).
 *
 * @layer infra/runtime
 * @remarks
 * - **Serveur uniquement** : utilise `fs` et `path`, ne pas importer côté client.
 * - Les fonctions lèvent les erreurs E/S natives sauf mention contraire.
 * - Le répertoire racine est `process.cwd()/content/published`.
 */

import { PUBLISHED_CONTENT_STATE } from "@/constants/shared/common";
import type { Page } from "@/core/domain/pages/entities/page";
import type { SiteIndex } from "@/core/domain/site/entities/site-index";
import type { SiteSettings } from "@/core/domain/site/entities/site-settings";
import { isENOENT } from "@/infrastructure/utils/errors";
import { promises as fs } from "node:fs";
import path from "node:path";

/** Base absolue des contenus publiés. */
const BASE = path.join(process.cwd(), "content", PUBLISHED_CONTENT_STATE);

/**
 * Lit un fichier JSON et le parse.
 * @param p Chemin absolu du fichier JSON.
 * @returns Le contenu parsé de type `T`.
 * @throws Propagera les erreurs `fs.readFile` et `JSON.parse`.
 */
async function readJson<T>(p: string): Promise<T> {
  const raw = await fs.readFile(p, "utf8");
  return JSON.parse(raw) as T;
}

/**
 * Lit `settings/site.json`.
 * @returns `SiteSettings` parsé.
 */
export async function readPublishedSettings(): Promise<SiteSettings> {
  const p = path.join(BASE, "settings", "site.json");
  return readJson<SiteSettings>(p);
}

// export async function readPublishedSettingsSafe(): Promise<SiteSettings | null> {
//   try {
//     return await readPublishedSettings();
//   } catch (e) {
//     if (isENOENT(e)) return null;
//     throw e;
//   }
// }

/**
 * Lit `index.json`.
 * @returns `SiteIndex` parsé.
 */
export async function readPublishedIndex(): Promise<SiteIndex> {
  const p = path.join(BASE, "index.json");
  return readJson<SiteIndex>(p);
}

// export async function readPublishedIndexSafe(): Promise<SiteIndex | null> {
//   try {
//     return await readPublishedIndex();
//   } catch (e) {
//     if (isENOENT(e)) return null;
//     throw e;
//   }
// }

/**
 * Lit `pages/<slug>.json`.
 * @param slug Slug de la page (kebab-case).
 * @returns La `Page` parsée, ou `null` si le fichier est introuvable/inaccessible.
 * @remarks
 * - Le dossier est en minuscules : le slug est normalisé en `.toLowerCase()`.
 */
export async function readPublishedPage(slug: string): Promise<Page | null> {
  if (!slug) return null;
  const safe = slug.toLowerCase();
  const p = path.join(BASE, "pages", `${safe}.json`);
  try {
    return await readJson<Page>(p);
  } catch (e) {
    if (isENOENT(e)) return null;
    throw e;
  }
}
