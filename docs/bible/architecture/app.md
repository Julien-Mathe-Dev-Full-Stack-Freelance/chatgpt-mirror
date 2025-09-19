# Architecture — `src/app`

L'espace `src/app` implémente l'App Router de Next.js. Il orchestre les providers globaux (thème, i18n), expose les routes publiques et admin, et héberge les API routes.

## Structure

| Chemin                        | Rôle                                        | Points clés                                                                                                       |
| ----------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `layout.tsx`                  | Shell global partagé par toutes les routes. | Charge `globals.css`, installe les polices Geist, fournit les providers `I18nProvider` et `ThemeProvider`.        |
| `globals.css`                 | Base CSS (reset + variables).               | Définit les thèmes `site-theme` et `admin-theme`, intègre les tokens Tailwind partagés.                           |
| `page.tsx`                    | Page publique d'accueil.                    | Point d'entrée minimal tant que le contenu n'est pas branché ; doit rester agnostique du code admin.              |
| `admin/`                      | Espace protégé pour le studio.              | `layout.tsx` applique `admin-theme`, compose l'UI Atomic Design ; `error.tsx` gère les erreurs server components. |
| `admin/pages/[slug]/page.tsx` | Éditeur de page admin.                      | Invoque les adapters `@/infrastructure/http/admin/*`, passe par les hooks `@/hooks/admin`.                        |
| `[slug]/page.tsx`             | Rendu public d'une page.                    | Consomme `@/lib/public/content` et les composants `@/components/public-site`.                                     |
| `api/**`                      | Routes API Next.js (REST-like).             | Doivent utiliser `handleRoute` + `parseDTO` (`@/lib/api/handle-route`, `@/schemas/...`).                          |

## Règles d'implémentation

- **Validation** : importer les schémas Zod et utiliser `parseDTO(schema, data)` dans chaque handler API (interdit d'appeler `.parse()` directement).
- **Logs côté serveur** : préférer `log.child({ ns })` pour contextualiser les messages (`@/lib/log`).
- **i18n** : côté client, récupérer le hook `useI18n()` ; côté server, utiliser `getRequestT()` (`@/i18n/server`).
- **UI** : les routes `admin/**` ne rendent que des composants depuis `@/components/admin` / `@/components/shared`.
- **Contenu** : `[slug]` doit uniquement lire via les services exposés (`@/lib/public/content`, `@/infrastructure/pages`).

## À documenter lors de la V1

- Lister les API routes existantes et leurs DTO (`src/app/api/**`).
- Documenter le mécanisme d'authentification/guard (à ajouter lorsque présent).
- Détailler comment les erreurs sont rendues côté admin/public (composants `ErrorBoundary`, `not-found`).
