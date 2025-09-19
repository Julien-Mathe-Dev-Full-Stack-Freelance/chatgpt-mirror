# Infrastructure — Adapters & services

`src/infrastructure` fait le lien entre le domaine et les couches d'interface. On y trouve les implémentations concrètes des ports (HTTP, filesystem), des constantes d'infrastructure et des helpers UI.

## Sous-sections

### Constants (`src/infrastructure/constants`)

- `endpoints.ts` : source de vérité des URLs utilisées par les clients HTTP (`/api/admin/pages`, `/api/admin/site-settings`, etc.).
- À maintenir en synchronisation avec `src/app/api/**`.

### HTTP (`src/infrastructure/http`)

- `admin/**` : clients fetch pour l'espace admin (pages, site, site-settings) basés sur `apiFetch` / `request`.
- `shared/_internal.ts` : encodeurs d'URL, gestion des états (`withState`), instrumentation (`request`).
- `shared/api-error.ts` : mapping des erreurs HTTP vers un format exploitable par l'UI.

### Pages (`src/infrastructure/pages`)

- `file-system-pages-repository.ts` : implémentation du `PagesRepository` qui lit/écrit dans `content/` (utilisé côté admin).
- `in-memory-pages-repository.ts` : version volatile pour tests/dév.

### Site (`src/infrastructure/site`)

- Services pour charger/persister les réglages du site (identité, menus, SEO) depuis le filesystem.

### UI (`src/infrastructure/ui`)

- Classes Tailwind réutilisables (`CONTAINER_CLASS`, `CARD_CLASS`, etc.).
- Doit être la seule source de vérité des tokens de style partagés.

### Utils (`src/infrastructure/utils`)

- Helpers transverses (ex. `ensureDirectory`, `fs` wrappers) utilisés par les repositories filesystem.

## Rappels V1

- Respecter les contrats du domaine (`ports`) et ne jamais importer de composants UI.
- Encapsuler tous les accès externes (filesystem, fetch) ici ; les use cases n'en sont jamais conscients.
- Documenter toute nouvelle dépendance externe (librairie, API) dans cette section.
