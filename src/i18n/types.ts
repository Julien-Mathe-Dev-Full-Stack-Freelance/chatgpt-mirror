/**
 * @file src/i18n/types.ts
 * @intro i18n — types partagés (purs)
 * @layer i18n/core
 */
export type MessagesTree = { readonly [k: string]: string | MessagesTree };
