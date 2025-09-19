# Domaine — Blocks

## Source de vérité

- `src/core/domain/blocks/constants.ts` : `BLOCK_TYPES`, `BlockType`, `BLOCK_ALIGNMENTS`, `BlockAlignment`, `isBlockType`, `isBlockAlignment`.
- `src/core/domain/blocks/model.ts` : union discriminée des blocs (p.ex. `TextBlock`, `ImageBlock`).

## Types supportés (V1)

- `BlockType` : `"text" | "image"`
- `BlockAlignment` : `"start" | "center" | "end"`

## Invariants

- Les unions sont **fermées** et centralisées dans `constants.ts`.
- Les schémas `src/schemas/blocks/**` **réutilisent** ces unions (pas de redéfinition de strings en dur).
- Aucun import UI/infra dans la couche domaine.

## Checklist V1

- [ ] En-tête JSDoc présent dans `constants.ts` (avec `@sot` vers ce fichier).
- [ ] Pas de `any`.
- [ ] Unions fermées + `as const`.
- [ ] `isBlockType` / `isBlockAlignment` exportés et utilisés par les adapters/DTOs.
