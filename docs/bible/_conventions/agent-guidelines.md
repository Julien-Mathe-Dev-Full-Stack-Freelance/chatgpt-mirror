# Règles d’intervention Codex

Ces consignes cadrent nos échanges pendant la passe.

## Processus

- **Validation explicite obligatoire** : aucune modification tant que tu n’as pas donné ton accord clair.
- **Toujours expliquer avant d’agir** : décrire l’approche ou le plan de doc avant intervention.
- **Statut de la demande** : signaler `doc-only` si la réponse est documentaire et `déjà résolu` si le code couvre déjà le besoin.

## Workflow de collaboration

- **Instantané local uniquement** : je travaille sur le mirror public (lecture seule).
- **Validation d’étape** : quand tu confirmes « ok, prochain fichier », j’assume que tu as appliqué les modifs et mis à jour l’inventaire.
- **Gestion des divergences** : si tu prises un autre chemin, partage le diff/la version à jour avant la suite.
- **Nouvelle session** : en début de conversation, fournir le bootstrap (mirror, branche, commit).
- **Journal partagé** : tenir `docs/bible/_roadmap/src-inventory.md` après chaque fichier.

## Commandes

- **Pas de tests/lint** sans demande explicite.
- **Git côté agent** : aucune commande sur ton environnement ; uniquement ce qui est nécessaire pour préparer les patchs.

## Communication

- **Langue** : réponses en français.
- **Livrables** : fichiers prêts à coller ; **un seul bloc par fichier** (JSDoc + commentaires inline intégrés).

## Rappels techniques clés (V1)

- **Imports** : **alias `@/…` obligatoire**, pas de chemins relatifs profonds.
- **Incohérences** : **uniquement Bloquant/Majeur**, et **confirmées** après lecture des **fichiers liés** (modèles/DTO/schémas/adapters).
- **Fences** : `.md` → balise par défaut ; code → `~~~` (ex. `~~~ts`).
- **Pas de `@see`** dans les en-têtes JSDoc.

_Mettre à jour ce document dès qu’une nouvelle règle d’intervention est convenue._
