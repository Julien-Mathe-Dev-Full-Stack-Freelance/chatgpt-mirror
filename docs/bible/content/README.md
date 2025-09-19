# Contenu — Workflow fichiers

Le dossier `content/` héberge la source de vérité des pages et réglages lorsqu'on utilise le repository filesystem. Il est consommé par `src/infrastructure/pages` et `src/lib/public/content`.

## Structure générale

```
content/
├─ draft/
│  ├─ index.json      # Index des pages (état draft).
│  ├─ pages/          # Contenu détaillé des pages (JSON).
│  └─ settings/       # Réglages site (identity, menus, theme...).
└─ published/
   ├─ index.json
   ├─ pages/
   └─ settings/
```

## Cycle de vie

1. L'admin manipule l'état **draft** via les use cases (`createPage`, `updatePage`, etc.).
2. Les repositories filesystem écrivent les JSON correspondants dans `content/draft/**`.
3. Lors d'une publication (`publish-site`), les fichiers sont synchronisés vers `content/published/**`.
4. Le site public (`src/app/[slug]`) ne lit que l'état `published`.

## Rappels V1

- Garder les fichiers JSON triés et valides (veille à l'indentation 2 espaces).
- Toujours passer par les use cases/domain pour modifier le contenu (pas d'écriture directe depuis l'UI).
- Documenter ici tout nouveau sous-dossier (ex. assets, media) lorsque le projet s'étend.
