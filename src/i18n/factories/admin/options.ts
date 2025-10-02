/**
 * @file src/i18n/factories/admin/options.ts
 * @intro i18n — factories admin (options labellisées)
 * @layer i18n/core
 * @sot docs/bible/ui/i18n-factories.md
 *
 * @remarks
 * - Ces helpers ne font AUCUN fetch/I-O ; ils dépendent de `t: TFunc`.
 */

import type { TFunc } from "@/i18n";

/** Option labellisée, typée sur la valeur. */
export type LabeledOption<V extends string> = Readonly<{
  value: V;
  label: string;
}>;

/**
 * Construit une clé i18n fortement typée `${prefix}.${value}`.
 * Évite `as any` et conserve l’auto-complétion sur `value`.
 */
export function asI18nKey<P extends string, V extends string>(
  prefix: P,
  value: V
): `${P}.${V}` {
  // Concat runtime + type affiné compile-time (pas de vérification catalogue ici).
  return `${prefix}.${value}` as `${P}.${V}`;
}

/**
 * Construit des options labellisées à partir d’un prefix i18n et d’un ensemble de valeurs.
 *
 * @example
 * const TABS = ["overview","identity","menu"] as const;
 * const opts = makeLabeledOptions(t, "admin.tabs", TABS);
 */
export function makeLabeledOptions<
  const V extends readonly string[],
  P extends string
>(t: TFunc, prefix: P, values: V): ReadonlyArray<LabeledOption<V[number]>> {
  return values.map((v) => ({
    value: v,
    label: t(asI18nKey(prefix, v)),
  })) as ReadonlyArray<LabeledOption<V[number]>>;
}
