# docs/bible/domain/entities/README.md

# Entities — SoT (IDs stables)

> **But** : définir la liste **canonique** des entités du domaine et leurs identifiants **stables** (non i18n).  
> **Portée** : `src/core/domain/entities/*`, schémas `src/schemas/**`, use-cases/DTO/adapters et UI qui mappent ces entités.

## 1) Contenu (SoT)

- **Kinds (#kinds)**
  - Union fermée `EntityKind` basée sur `ENTITY_KINDS`.
  - Type-guard : `isEntityKind(v)`.
  - IDs **stables** : utilisés comme clés de mapping (DTO, routes, repositories, UI).

## 2) Invariants

- **Stabilité** : un `EntityKind` ne change pas de libellé (contrat inter-couches).
- **Non i18n** : ces IDs sont techniques (pas destinés à l’affichage).
- **Union fermée** : toute valeur hors `ENTITY_KINDS` → invalide (schémas + guard).

## 3) Exemples

### Schéma Zod (extrait)

```ts
import { ENTITY_KINDS } from "@/core/domain/entities/constants";
const EntityKindSchema = z.enum(ENTITY_KINDS);
```

### Mapping UI (extrait)

```ts
const ENTITY_ICON: Record<EntityKind, ReactNode> = {
  header: <HeaderIcon />,
  identity: <IdIcon />,
  menu: <MenuIcon />,
  primaryMenu: <MenuIcon />,
  legalMenu: <ScaleIcon />,
  social: <ShareIcon />,
  page: <PageIcon />,
  block: <BlockIcon />,
  footer: <FooterIcon />,
  theme: <PaletteIcon />,
  seo: <SearchIcon />,
};
```

## 4) Relations

- **Constants (domain)** : `docs/bible/domain/constants/README.md` (settings, limits, layout, theme, urls, web).
- **Schémas** : `src/schemas/**` (valider `EntityKind` via `z.enum(ENTITY_KINDS)`).
- **Use-cases/Infra** : repositories, routes, DTO qui discriminent par `EntityKind`.

---

## Kinds

Ancre : `#kinds`

- **Fichier** : `src/core/domain/entities/constants.ts`
- **Expose** :
  - `ENTITY_KINDS` (liste canonique)
  - `type EntityKind` (union fermée)
  - `isEntityKind(v)` (guard robuste)
- **Notes** :
  - Ajouter un nouveau kind **ici**, puis mettre à jour : schémas, mappings UI, seed/DTO si concernés.
