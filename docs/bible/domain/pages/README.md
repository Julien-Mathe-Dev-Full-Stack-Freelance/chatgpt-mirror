# docs/bible/domain/pages/README.md

# Pages — Defaults (SoT)

> **But** : Centraliser les valeurs défaut du layout de page, stables et réutilisables.  
> **Portée** : `src/core/domain/pages/defaults/page.ts`

## 1) Layout defaults

- **Defaults atomiques** :
  - `DEFAULT_PAGE_MAX_WIDTH: "normal"`
  - `DEFAULT_PAGE_SPACING_Y: "medium"`
  - `DEFAULT_PAGE_ALIGN_X: "start"`
- **Default composite** : `DEFAULT_PAGE_LAYOUT` (gelé via `deepFreeze`).

### Contrats & invariants

- Les unions/tuples de référence : voir **`docs/bible/domain/constants/README.md#layout`**.
- Garde **dev-only** : parité stricte avec `SECTION_MAX_WIDTHS`, `SECTION_SPACING_Y`, `SECTION_ALIGN_X`.
  - Échec → `DomainError { code: INTERNAL }` (diagnostic local, non exposé UI).

### Usage (exemple)

- Importer `DEFAULT_PAGE_LAYOUT` comme base, puis surcharger au besoin.
- Si une section ne modifie qu’un seul axe, préférer importer la **constante atomique** correspondante.

## 2) Liens SoT

- **Layout (tuples & types)** : `docs/bible/domain/constants/README.md#layout`
- **Utilitaire** : `deepFreeze` _(voir la page utilitaires si existante, sinon à créer)_
