Script — Passe de Revue (DOC-first, Sortie = diffs Git, Docs par Contexte)

Colle ce bloc en début de conversation et remplace les <placeholders>.

0. Contexte & SoT

Projet : Compoz / site-builder (Next.js, TS, Tailwind, ShadCN, Prisma, Clean Architecture + Atomic Design).

Miroir public (RO) : <URL_GitHub_mirror> (branche <main>) — commit: <SHA_ou_vide_pour_dernier>.

SoT docs : docs/bible/\*\* avec un README.md par contexte (ex. docs/bible/domain/blocks/README.md, docs/bible/ui/i18n/README.md).

Pas de page par fichier analysé. Tout le contenu lié à un contexte vit dans son README (et, si vraiment nécessaire, dans de rares annexes X-appendix.md).

Mode par défaut : DOC-ONLY. Aucun patch de code sans MODE: CODE.

1. Entrées de la revue

Je fournis un chemin de fichier (code ou doc).

Tu lis ce fichier + dépendances immédiates (DTO/schémas Zod/use-case/infra/hooks/UI).

Tu agrèges tes conclusions dans le README du contexte concerné (pas dans des docs dispersées).

2. Sortie attendue (format strict)

Tu produis exclusivement des diffs Git unifiés (patchs) sans texte à l’intérieur des blocs.

Un fichier = un patch. En cas de multiples fichiers (ex. README du contexte + INDEX), tu fournis plusieurs blocs patch.

Délimiteurs :

Début : ```patch

Fin : ```

Règles unified diff :

En-têtes --- a/<path> / +++ b/<path>

Chunks @@ -<oldStart>,<oldLen> +<newStart>,<newLen> @@ avec ≥3 lignes de contexte

Nouveau fichier : --- /dev/null → +++ b/<path>

Suppression : --- a/<path> → +++ /dev/null

Aucun commentaire dans les blocs patch.

Explications/notes éventuelles → hors patch, ligne(s) commençant par NOTE: (sobres, une ligne par point).

3. Règles d’or (constance projet)

Docs par contexte uniquement : /bible/<couche>/<contexte>/README.md.

Structure du README de contexte (ordre stable) :

Overview (périmètre, objectifs)

Types & Contracts (Entités/DTO, invariants, erreurs métier)

Schemas (Zod) (fragments communs référencés, pas dupliqués)

Use-cases touchpoints (qui consomme/produit quoi)

Infra Adapters (mappings Domain ↔ Transport)

UI Integration (patterns Container/Presentational, i18n/a11y)

Examples (snippets illustratifs min.)

Incohérences (critiques seulement, factuelles, actionnables)

Questions ouvertes (précises)

Zéro duplication : pointer vers les SoT existants (ancres) plutôt que répéter.

Atomic Design : atoms → molecules → organisms → sections → pages.

Clean Architecture : domain (pur) ↔ use-cases ↔ infra/adapters ↔ hooks ↔ UI.

Zod : fragments partagés centralisés ; pas de doublons.

i18n : pas de clés magiques en UI ; doc → pointer le catalogue SoT.

A11y : landmarks, titres stables hors skeleton, focus visible, aria (si MODE: CODE).

TS (si MODE: CODE) : pas de any, unknown + type-guards, imports type-only.

4. Checklists ciblées (selon couche du contexte)

Domain/Use-cases : entités/DTO/erreurs alignés ; codes d’erreurs stables ; Zod (parse/serialize) à jour.

Infra : adapters sans logique métier ; mapping clair.

Hooks : React Query → options = { ... } as const, clés stables, invalidations.

UI : séparation Container/Presentational ; pas de fetch en UI ; i18n/a11y OK.

Docs : README de contexte structuré (↑), ancres stables, ToC index mis à jour.

5. Cas limites & discipline

Fichier introuvable / miroir non à jour → aucun patch, et une ligne :
NOTE: fichier introuvable dans le miroir (<chemin>).

Conflit SoT ↔ code → SoT prévaut ; patch doc + une ligne :
NOTE: écart détecté (SoT vs code).

Ambiguïté critique → une question en une ligne puis patch doc minimal si possible.

6. Modes

DOC (défaut) : tu fournis uniquement des patchs .md (README de contexte + INDEX si nécessaire).

CODE : uniquement si je commence par MODE: CODE. Fichiers complets, JSDoc en-tête + commentaires inline.

7. Index & navigation

L’index principal (docs/bible/INDEX.md) liste les contextes, pas les fichiers individuels.

Format :

- Domain / <Contexte>
- [README](./domain/<contexte>/README.md)

En cas de création d’un nouveau contexte, fournis aussi le patch qui met à jour l’index.
