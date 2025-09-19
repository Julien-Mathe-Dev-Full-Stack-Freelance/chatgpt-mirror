# Glossaire & suivi des notions

Ce document centralise les termes métier/techniques rencontrés pendant la rédaction de la documentation. Complète-le à mesure que de nouveaux concepts apparaissent dans `src/`.

| Terme          | Définition                                                  | Référence code                   | Notes                                                |
| -------------- | ----------------------------------------------------------- | -------------------------------- | ---------------------------------------------------- |
| ContentState   | État d'une page (`draft` ou `published`).                   | `@/core/domain/constants/common` | Conditionne la lecture/écriture dans `content/`.     |
| SiteIndex      | Index des pages exposées publiquement.                      | `@/core/domain/site/index`       | Mis à jour via `updateSiteIndex`.                    |
| Namespace i18n | Regroupement de messages (`admin`, `site`, `errors`, etc.). | `@/i18n/namespaces.ts`           | À documenter lors de l'ajout d'un nouveau namespace. |

> Astuce : lier chaque entrée à la documentation détaillée correspondante (ex. pages use-cases → `../domain/README.md`).
