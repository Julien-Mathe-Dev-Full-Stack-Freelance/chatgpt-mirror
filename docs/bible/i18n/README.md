# Internationalisation — Référence

Le dossier `src/i18n` regroupe la stack de traduction. Il fournit les catalogues, les providers React et les helpers serveur pour obtenir un `t()` cohérent.

## Structure

- `context.tsx` : provider React + hook `useI18n()` (client). Met à jour `<html lang>` et persiste la locale.
- `LanguageSwitcher.tsx` : composant UI pour changer la locale (admin/public).
- `default.ts` : fallback `defaultT` à utiliser dans le code partagé (schémas, normalizers).
- `factories/` : helpers pour créer des traducteurs namespacés (`createI18nFactory`).
- `locales/` : catalogues JSON/TS (FR par défaut) regroupés par namespace.
- `meta.ts` : description des locales disponibles (codes, libellés).
- `namespaces.ts` : noms de namespaces standard (admin, site, errors, blocks…).
- `server.ts` : `getRequestT()` pour les routes server components / API.
- `types.ts` : typages de la stack i18n (Locale, Namespace, Messages).
- `useErrorI18n.ts` : hook utilitaire pour traduire les erreurs domaine/UI.

## Bonnes pratiques

- Ajouter tout nouveau message dans `locales/**` puis exposer un namespace clair (éviter les concaténations de strings).
- Utiliser `defaultT` dans les modules non React (domain/lib) pour conserver un fallback déterministe.
- Documenter ici tout nouveau namespace ou workflow (ex. synchronisation avec des CMS externes).
