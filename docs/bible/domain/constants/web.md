# Domaine — Constants — Web

## Source de vérité

- `src/core/domain/constants/web.ts` — `ABSOLUTE_ALLOWED_PROTOCOLS`, `isAbsoluteHttpProtocol`, `RELATIVE_URL_RE`, `isRelativeUrl`, `SIMPLE_EMAIL_RE`, `isSimpleEmail`.

## Rôle

- Définir la whitelist HTTP(s) partagée par le domaine et les adapters (pas de `javascript:` ou `mailto:` automatiques).
- Encapsuler la politique d'URL relative : chemin commençant par `/`, sans protocole implicite `//` ni backslash Windows.
- Stabiliser la validation des emails ASCII (utilisée par `mailto:` et les formulaires de contact).

## Invariants

- `ABSOLUTE_ALLOWED_PROTOCOLS` = `http:` ou `https:`. Toute extension doit être discutée (sécurité, SEO, analytics).
- `RELATIVE_URL_RE` n'accepte que les caractères ASCII usuels (`[\w\-./~%?#=&+]`) après le premier `/`.
- `SIMPLE_EMAIL_RE` cible l'ASCII (pas d'IDN) pour rester compatible avec `mailto:` (RFC 6068).

## Intégrations notables

- `@/core/domain/site/social/validator.ts` et `@/hooks/admin/site/social/useSocialSettings.ts` s'appuient sur `isRelativeUrl` pour filtrer les liens saisis dans l'admin.
- `@/core/domain/urls/mailto.ts` consomme `isSimpleEmail` lors du parse des destinataires.
- Les schémas `@/schemas/site/common.ts` exposent `RelativeUrlSchema` et `AbsoluteHttpUrlSchema` en cohérence avec ces gardes.

## Points de vigilance

- Étendre ces regex ou listes nécessite : mise à jour de cette page, des schémas Zod associés et des validations UI.
- Garder les helpers dans le domaine pour éviter les divergences entre API, studio admin et site public.
