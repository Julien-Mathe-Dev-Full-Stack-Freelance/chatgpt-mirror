# Architecture — Vue d'ensemble

Cette page offre une lecture rapide de la structure du dépôt et du sens des dépendances. Elle complète les règles génériques décrites dans [`../_conventions/project-guidelines.md`](../_conventions/project-guidelines.md).

## Couche par couche

| Couche               | Dossier principal                                         | Rôle clé                                                                                                     | Dépend de                                               |
| -------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| Domaine              | `src/core/domain`                                         | Modéliser le métier, les use cases et les règles d'invariants.                                               | Rien en dehors du domaine ; utilitaires purs seulement. |
| Validation / libs    | `src/schemas`, `src/lib`                                  | Encapsuler la validation Zod, les helpers transverses et l'infrastructure légère (log, HTTP, normalisation). | Domaine pour les types, pas l'inverse.                  |
| Infrastructure       | `src/infrastructure`                                      | Adapter le domaine aux implémentations concrètes (persistence, HTTP client, configuration UI).               | Domaine + libs partagées.                               |
| Présentation         | `src/components`, `src/constants`, `src/hooks`, `src/app` | Exposer l'UI (Atomic Design), intégrer les use cases via adapters, fournir les routes Next.js.               | Infrastructure + libs.                                  |
| Internationalisation | `src/i18n`                                                | Exposer les factories de traduction, hooks client/serveur, catalogues.                                       | Libs partagées et, ponctuellement, typages du domaine.  |

## Arborescence `src/`

```
src/
├─ app/                # Routes Next.js, layout global et CSS racine.
├─ components/         # Atomic Design : admin, public-site, shared, ui.
├─ constants/          # Constantes UI réutilisables (admin, shared).
├─ core/domain/        # Bloc métier (entités, use cases, erreurs, utils).
├─ hooks/              # Hooks React partagés (`_shared`) et spécifiques admin.
├─ i18n/               # Contextes, factories, locales, helpers de traduction.
├─ infrastructure/     # Adapters HTTP, repos fichier, services UI.
├─ lib/                # Helpers transverses (API, diff, log, normalize, patch...).
└─ schemas/            # Schémas Zod et bootstrap commun.
```

## Flux principal

1. Une interaction utilisateur transite par une page Next (`src/app/**`), qui compose des composants `src/components/**`.
2. Les composants utilisent des hooks/adapters (`src/hooks`, `src/infrastructure`) pour invoquer les use cases.
3. Les use cases vivent dans `src/core/domain/**` et s'appuient sur des ports (repositories, runners) injectés depuis l'infrastructure.
4. Les validations et transformations partagées s'appuient sur `src/schemas/**` et `src/lib/**`.
5. L'i18n fournit les traductions nécessaires selon l'espace (client, serveur, code partagé).

## Points de vigilance V1

- Maintenir le sens des dépendances (pas d'import UI → domaine).
- Systématiser l'utilisation des types exportés par le domaine (`Entity["prop"]`).
- Centraliser les invariants et patterns transverses dans les sections dédiées (lib, schemas, i18n) pour éviter la duplication.
- Documenter toute nouvelle règle dans les fichiers de conventions avant d'étendre cette documentation.

## Prochaines étapes

- Détail par dossier : voir les pages spécifiques (`app.md`, `../domain/README.md`, etc.).
- À la première passe de documentation, cocher l'entrée correspondante dans [`../_roadmap/src-inventory.md`](../_roadmap/src-inventory.md).
