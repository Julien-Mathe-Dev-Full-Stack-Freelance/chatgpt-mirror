# Passe de revue V1 — Script & conventions

## Objectifs de la passe

Aligner la JSDoc (en-têtes de fichier, signatures, invariants, liens SoT).  
Ajouter des commentaires inline utiles (raison d’être, pièges, invariants locaux).  
Vérifier la conformité V1 (patterns, clean archi, atomic design, i18n, DTO/validation).  
Remonter les écarts (liste « Non-conformités V1 ») et proposer la doc à créer/mettre à jour.

## Périmètre des modifications pendant la passe V1

- Autorisé : **JSDoc d’en-tête** + **commentaires inline** (sections, invariants, pièges).
- Interdit : tout changement de **logique**, de **signature**, d’**exports**, d’**imports**.
- Formatage : permis **uniquement** pour insérer des commentaires, sans altérer le runtime.
- Vérif croisée : avant de signaler un écart, **lire les fichiers liés** (DTO, schémas, adapters).
- Imports : **alias `@/...` obligatoires** (bannir chemins relatifs profonds).

---

# Script

## Mirror & source

- Mirror public : https://github.com/Julien-Mathe-Dev-Full-Stack-Freelance/chatgpt-mirror.git
- Branche mirror : main
- Repo privé (source de vérité) : <hébergeur/URL privé non nécessaire>
- Branche source : staging
- Commit à considérer : <SHA> (optionnel — sinon, dernier de staging reflété dans le mirror)

## Cadre & attentes (SoT)

- Mode : **doc-only** (pas de patch tant que non validé).
- **Format de livraison par fichier : un seul bloc** contenant **JSDoc + commentaires inline intégrés** (pas d’éclatement).
- **Incohérences** : ne signaler **que les points critiques (Bloquant/Majeur)**, **après vérification croisée** des **fichiers liés** (modèles/DTO/schémas/adapters).
- **Imports** : **alias `@/…` obligatoire** (bannir les chemins relatifs profonds). Tout import non `@/` est **non-conforme V1 (Majeur)** si l’alias existe.
- Rendu dans la conversation :
  - Fichiers **.md** : balise par défaut pour ouvrir/fermer.
  - **Code** : fences **~~~** (ex. `~~~ts`) ; pas de styles exotiques.
- Pas de tests/lint, pas de commandes sur l’environnement de l’utilisateur.
- Si une règle transversale émerge, proposer la MAJ de `docs/bible/_conventions/*.md` et de l’index.

## Livrables attendus par fichier

1. Statut : `doc-only`
2. **Fichier unique** prêt à coller (JSDoc + inline)
3. (Seulement si critique) Check V1 + non-conformités (Bloquant/Majeur)
4. Docs à créer/mettre à jour (chemins + contenu prêt)

---

## Première tâche

- Analyse ce fichier : `<src/.../mon-fichier.ts>`
- Focus : JSDoc complète + commentaires non triviaux + conformité V1 (DTO/parseDTO, i18n, atomic design, clean archi, logs, normalizers, next/image, etc.)

### Raccourcis

- **Analyser un fichier (doc-only)** : `Analyse: src/<chemin/fichier.ts> @ <SHA-optionnel>`
- **Basculer en patch** : `OK pour patcher le fichier précédent. Contrainte: ne modifier que <zones>.`
- **Resync de session** : `Resync: j’ai mergé X et Y. Repars du mirror à jour.`

---

## Modèles JSDoc officiels

### Règles générales

- Français, phrases courtes, verbes d’action (privilégier le « pourquoi »).
- Tags obligatoires : `@file`, `@intro`, `@layer`, `@sot` (si SoT existe) ; `@remarks` optionnel.
- **Pas de `@see`** dans l’en-tête.
- Types only : `export type { … }` / `import type …`.
- Un seul en-tête JSDoc par fichier, placé tout en haut.

### En-tête de fichier TypeScript/TSX

```ts
/**
 * @file <chemin depuis src/>       // ex: src/core/domain/pages/use-cases/create-page.ts
 * @intro Résume en 1 ligne le rôle métier du fichier.
 * @layer <domaine|use-cases|infrastructure|ui/atoms|ui/molecules|ui/organisms|sections|app|lib|schemas|i18n>
 * @sot docs/bible/<chemin-vers-la-page-SoT>.md
 * @description
 * - Points clés (3–5 puces max) : invariants, dépendances, effets secondaires.
 * - Frontières : ce que le fichier ne fait pas (hors scope).
 * @remarks
 */
```

### Fonction utilitaire / service pur

```ts
/**
 * Calcule X à partir de Y.
 * @param input Description courte (type attendu).
 * @returns Résultat normalisé (forme exacte).
 * @throws Never (si applicable) ou liste d’exceptions métier connues.
 * @example
 * const out = computeX(in);
 */
```

### Use case (orchestration métier)

```ts
/**
 * Orchestration métier pour <action>.
 * Invariants: <slug unique>, <état cohérent>, etc.
 * Ports injectés: PagesRepository, Clock.
 * @returns Entité/DTO mis(e) à jour + effets (ex: index).
 * @throws UseCaseError<CODE> mappables vers HTTP/UI.
 */
```

### Hook React

```ts
/**
 * Hook <verbe> qui <fait>.
 * Effets: réseau/dépendances/aborts.
 * @returns API du hook (state + actions).
 * @remarks Respecter règles deps exhaustive + mémoïsation des patchs.
 */
```

### Composant React (Atomic Design)

```ts
/**
 * Composant <Atom/Molecule/Organism/Section> : <rôle UI>.
 * Accessibilité: aria-*, structure sémantique, focus.
 * Performance: mémoïsation, images via next/image, classes via cn().
 * @example
 * <MyComponent propA="..." />
 */
```

### API Route (Next.js App Router)

```ts
/**
 * API <GET|POST|PATCH|DELETE> <path>.
 * Contrat: DTO in/out, enveloppe { settings: … } si réglages.
 * Validation: parseDTO(schema, body/query).
 * Logs: info/warn/error (ns = route).
 * @returns Response JSON (codes stables).
 */
```

### Schéma Zod / DTO

```ts
/**
 * Schéma de validation pour <ressource>.
 * Source de vérité: DTO côté domaine (ne pas dépendre du schéma dans l’UI).
 * Mapping erreurs: zodToHttp (codes/documentés).
 */
```

## Règles pour commentaires inline

**Quand ?** choix non trivial (perf, DX, compat), invariant local, piège, `// TODO(V1): …` clair.  
**Comment ?** une ligne courte au-dessus du bloc concerné ; pas de paraphrase ; sections pour fichiers longs :

```ts
// ───────────────────────────────────────────────────────────────────────────────
// Section: Adaptation du patch (stabilise la ref pour React deps)
// ───────────────────────────────────────────────────────────────────────────────
```

## Attentes V1 (checklist de conformité)

**4.1 Architecture & dépendances**  
Sens des dépendances (UI → infra → use-cases → domaine) ; aucune importation UI dans domaine/infra ; ports injectés.

**4.2 TypeScript & modules**  
Aucun `any` (sauf `// TODO(V1): remove any`) ; `export type` vs symboles runtime cohérents ; types indexés préférés ;  
**Imports** : **alias `@/…` uniquement** (bannir les chemins relatifs profonds).

**4.3 DTO / Validation / API**  
DTO source en domaine ; `parseDTO(schema, value)` partout ; `zodToHttp` ; messages courts, codes stables.

**4.4 i18n**  
`createTSafe` ; `useI18n()` client / `getRequestT()` serveur ; `defaultT` pour code partagé ; clés en `src/i18n/locales/**`.

**4.5 UI / Accessibilité / Images**  
`next/image` plutôt que `<img>` ; sémantique + aria-\* ; classes via `cn()` et tokens infra UI ; Atomic Design respecté.

**4.6 Normalizers / Patches**  
Entrées normalisées via `src/lib/normalize.ts` ; `adaptPatchKV` mémoïsé avant `onPatch`.

**4.7 Observabilité**  
`log.child({ ns })` ; pas de logs en domaine pur ; mesurer les durées sensibles.

**4.8 JSDoc & SoT**  
En-tête présent et à jour ; `@sot` vers la page doc ; `@remarks` si utile.

---

## Rappel — Garde-fous (Codex)

Validation explicite avant modif ; pas de tests/lint sans demande ; journal partagé à jour ; nouvelle session = récap d’état pour resync.
