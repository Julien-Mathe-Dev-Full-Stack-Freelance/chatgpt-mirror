# docs/bible/domain/constants/README.md

# Constants — SoT (Single Source of Truth)

> **But** : centraliser les constantes **métier** transverses exposées sous forme d’unions fermées / valeurs normalisées pour éviter les « magic values » et garder **UI**, **schémas** et **use-cases** synchronisés.  
> **Portée** : `src/core/domain/constants/*`, schémas `src/schemas/**`, use-cases/DTO/adapters qui consomment ces constantes.

## 1) Contenu (SoT)

- **Common** — [`#common`](#common)
  - États de contenu : `ContentState` = `"draft" | "published"` ; `DEFAULT_CONTENT_STATE`, `PUBLISHED_CONTENT_STATE`.
  - Positions d’insertion : `InsertPosition` = `"prepend" | "insert" | "append"`.
  - Guards : `isContentState(v)`, `isInsertPosition(v)`.
- **Layout** — [`#layout`](#layout)
  - Alignements : `HorizontalAlignment`/`VerticalAlignment` = `"start" | "center" | "end"`.
  - Défauts : `DEFAULT_H_ALIGN`, `DEFAULT_V_ALIGN`.
  - Espacement : `SpacingStep` = `"none" | "xs" | "sm" | "md" | "lg" | "xl"`, `DEFAULT_SPACING_STEP`.
  - Guards : `isHorizontalAlignment(v)`, `isVerticalAlignment(v)`, `isSpacingStep(v)`.
- **Limits** — [`#limits`](#limits)
  - Titres/SEO/Menus/Blocs/Footer/Slugs/Publication/URLs — bornes numérales normalisées.
- **Theme** — [`#theme`](#theme)
  - Modes : `ThemeMode` = `"light" | "dark" | "system"`.
  - Palettes : `ThemePalette` = `"neutral" | "ocean" | "violet" | "forest"`.
  - Hauteurs : `HeaderFooterHeight` = `"small" | "medium" | "large"`.
  - Containers : `ContainerKey` = `"narrow" | "normal" | "wide" | "full"`.
  - Guards : `isThemeMode(v)`, `isThemePalette(v)`, `isHeaderFooterHeight(v)`, `isContainerKey(v)`.
- **Urls** — [`#urls`](#urls)
  - Chemins **relatifs** canoniques : `/`, `/mentions-legales`, `/cookies`.

## 2) Invariants

- **Unions fermées** : toute valeur hors union → invalide (schémas + guards).
- **SoT unique** : ces constantes ne sont définies **qu’ici** ; validations Zod / feedback UI doivent y référer.
- **Alignements homogènes** : `"start" | "center" | "end"` partagés (layout/blocks), mappés par l’UI via des tokens.
- **A11y** : alt d’image ≥ 1 caractère (cf. `IMAGE_ALT_MIN`).
- **URLs relatives** : les chemins constants sont relatifs ; utiliser les helpers (`rel()`/`href()`) pour exposition publique.

## 3) Exemples d’usage

### Schémas Zod

- `z.enum(H_ALIGNMENTS)` / `z.enum(SPACING_STEPS)` / `z.enum(THEME_MODES)`
- `z.string().min(SITE_TITLE_MIN).max(SITE_TITLE_MAX)`
- `z.array(ItemSchema).max(MENU_ITEM_MAX)`

### UI (compteurs & mapping)

- Compteurs basés sur `SEO_TITLE_MAX`, `SEO_DESCRIPTION_MAX`, etc.
- Mapping `ContainerKey → classes` ; `ThemePalette → variables CSS` ; `HorizontalAlignment → utilities`.

### Use-cases / Routes

- Initialiser l’état avec `DEFAULT_CONTENT_STATE`.
- Rejeter `state`/`position`/`alignment` hors union → 400 (ou erreur domaine typée).

## 4) Relations

- **Common** : [`common.ts`](#common)
- **Layout** : [`layout.ts`](#layout)
- **Limits** : [`limits.ts`](#limits)
- **Theme** : [`theme.ts`](#theme)
- **Urls** : [`urls.ts`](#urls)
- **Blocs** : `docs/bible/domain/blocks/README.md#constants` (alignements communs)
- **Helpers URL** : `src/core/domain/urls/href.ts` _(conversion `rel()`/`href()` ; à confirmer selon implémentation)_

---

## Common

Ancre : `#common`

- **Fichier** : `src/core/domain/constants/common.ts`
- **Expose** :
  - États de contenu :
    - `DEFAULT_CONTENT_STATE = "draft"`
    - `PUBLISHED_CONTENT_STATE = "published"`
    - `CONTENT_STATES`, `type ContentState`, `isContentState(v)`
  - Positions d’insertion :
    - `POS_PREPEND = "prepend"`, `POS_INSERT = "insert"`, `POS_APPEND = "append"`
    - `INSERT_POSITIONS`, `type InsertPosition`, `isInsertPosition(v)`
- **Notes** :
  - Paramètres des guards typés `unknown` → robustesse et cohérence.

---

## Layout

Ancre : `#layout`

- **Fichier** : `src/core/domain/constants/layout.ts`
- **Expose** :
  - Alignements :
    - `H_ALIGNMENTS = ["start","center","end"]`, `type HorizontalAlignment`
    - `V_ALIGNMENTS = ["start","center","end"]`, `type VerticalAlignment`
    - `DEFAULT_H_ALIGN = "start"`, `DEFAULT_V_ALIGN = "start"`
    - Guards : `isHorizontalAlignment(v)`, `isVerticalAlignment(v)`
  - Espacement :
    - `SPACING_STEPS = ["none","xs","sm","md","lg","xl"]`, `type SpacingStep`
    - `DEFAULT_SPACING_STEP = "md"`, `isSpacingStep(v)`
- **Notes** :
  - Mêmes valeurs d’alignement que les **blocs** ; l’UI réalise le mapping vers utilitaires via tokens.

---

## Limits

Ancre : `#limits`

- **Fichier** : `src/core/domain/constants/limits.ts`
- **Expose** :
  - **Titres** :
    - `SITE_TITLE_MIN/MAX = 2/80`, `PAGE_TITLE_MIN/MAX = 2/80`, `IDENTITY_TITLE_MIN/MAX = 1/80`
  - **SEO** :
    - `SEO_TITLE_MIN/MAX = 1/60`, `SEO_TITLE_TEMPLATE_MIN/MAX = 2/120`, `SEO_DESCRIPTION_MIN/MAX = 1/160`
  - **Menus & Socials** :
    - `MENU_LABEL_MIN/MAX = 2/40`, `MENU_ITEM_MAX = 20`, `SOCIAL_ITEM_MAX = 20`
  - **Blocs** :
    - `TEXT_BLOCK_CONTENT_MIN/MAX = 1/5000`, `IMAGE_ALT_MIN/MAX = 1/160`, `IMAGE_CAPTION_MIN/MAX = 1/240`
  - **Footer** :
    - `FOOTER_COPYRIGHT_MIN/MAX = 1/160`
  - **Slugs & opérations** :
    - `SLUG_MIN = 1`, `MIN_PAGES_COPIED = 0`
  - **Publication** :
    - `PUBLISH_WARNING_MIN/MAX = 1/240`
  - **URLs** :
    - `MAX_URL_LENGTH = 2048`
- **Notes** :
  - Les bornes SEO (≈60/160) sont **indicatives d’affichage** (SERP), pas “moteur”.
  - Garder cohérence avec validations Zod & composants d’édition.

---

## Theme

Ancre : `#theme`

- **Fichier** : `src/core/domain/constants/theme.ts`
- **Expose** :
  - Modes : `THEME_MODES = ["light","dark","system"]`, `type ThemeMode`, `isThemeMode(v)`
  - Palettes : `PALETTES = ["neutral","ocean","violet","forest"]`, `type ThemePalette`, `isThemePalette(v)`
  - Hauteurs : `HEADER_FOOTER_HEIGHTS = ["small","medium","large"]`, `type HeaderFooterHeight`, `isHeaderFooterHeight(v)`
  - Containers : `CONTAINERS = ["narrow","normal","wide","full"]`, `type ContainerKey`, `isContainerKey(v)`
- **Notes** :
  - Palettes ↔ **tokens** (variables CSS / brand scale).
  - Containers ↔ classes utilitaires (conteneurs responsives).
  - Éviter la redondance sémantique avec `layout.ts`.

---

## Urls

Ancre : `#urls`

- **Fichier** : `src/core/domain/constants/urls.ts`
- **Expose** :
  - `DEFAULT_MENU_PATH = "/"`
  - `DEFAULT_LEGAL_MENTIONS_PATH = "/mentions-legales"`
  - `DEFAULT_LEGAL_COOKIES_PATH = "/cookies"`
- **Notes** :
  - **Relatifs** par design (commencent par `/`, pas de trailing slash — sauf racine).
  - Utiliser `rel()`/`href()` (`src/core/domain/urls/href.ts`) pour exposition (absolutisation/brand).
