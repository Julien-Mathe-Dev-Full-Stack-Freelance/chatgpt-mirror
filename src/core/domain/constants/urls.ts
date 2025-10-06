/**
 * @file src/core/domain/constants/urls.ts
 * @intro Chemins internes par défaut (navigation principale & légal).
 * @layer domain/constants
 * @sot docs/bible/domain/constants/README.md#urls
 * @description
 * - Baseline des routes **relatives** `/…` (SoT) : utilisées par les seeds i18n et les menus admin.
 * - Toujours passer par `rel()` / `href()` (`src/core/domain/urls/href.ts`) avant exposition publique.
 * - Tenir aligné avec les routes Next (accueil, mentions légales, politique cookies).
 * @remarks
 * - Invariant : chemins relatifs commençant par `/`, sans trailing slash (sauf racine `/`).
 */

// Page d'accueil — fallback partagé par les menus (brandé via `brandHref` côté hooks admin).
export const DEFAULT_MENU_PATH = "/" as const;

// Mentions légales : valeur canonique consommée par les seeds i18n + footer admin.
export const DEFAULT_LEGAL_MENTIONS_PATH = "/mentions-legales" as const;

// Politique cookies : même convention que la route Next correspondante.
// export const DEFAULT_LEGAL_COOKIES_PATH = "/cookies" as const;
