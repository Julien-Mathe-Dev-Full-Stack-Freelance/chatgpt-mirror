"use client";
/**
 * @file src/hooks/_shared/forms.ts
 * @intro Helpers génériques UI : mapping Zod -> erreurs de champs + focus
 * @layer hooks/shared
 */

/* ───────────────────────────── Helpers de typage ───────────────────────────── */

// type Primitive = string | number | boolean | null | undefined;
type StrNum = string | number;

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const isArray = <T = unknown>(v: unknown): v is T[] => Array.isArray(v);

const isStrNum = (v: unknown): v is StrNum =>
  (typeof v === "string" && v.trim().length > 0) || typeof v === "number";

/** Extrait la 1re clé d’un chemin d’issue (path: (string|number)[]) */
const firstPathKey = (issue: unknown): string | undefined => {
  if (!isRecord(issue)) return undefined;
  const path = issue["path"];
  if (!isArray<unknown>(path) || path.length === 0) return undefined;
  const head = path[0];
  return isStrNum(head) ? String(head) : undefined;
};

/* ───────────────────────────── extractFirstLevelFieldPaths ───────────────────────────── */

/**
 * Extrait les paths de 1er niveau depuis un payload d'erreur Zod (robuste aux variantes).
 * Gère :
 *  - payload.issuePaths?: (string|number)[]
 *  - payload.error.issuePaths?: (string|number)[]
 *  - payload.issues?: { path?: (string|number)[] }[]
 *  - payload.error.issues?: idem
 *  - payload.errors?: idem
 *  - payload.fieldErrors?: Record<string, unknown>
 *  - fallback: objet plat { field: message }
 */
export function extractFirstLevelFieldPaths(payload: unknown): string[] {
  const out = new Set<string>();

  const push = (v: unknown) => {
    if (isStrNum(v)) out.add(String(v));
  };

  if (!isRecord(payload)) return [];

  // 0) issuePaths (direct ou sous error)
  const directIssuePaths = payload["issuePaths"];
  if (isArray<unknown>(directIssuePaths)) {
    for (const p of directIssuePaths) push(p);
  }
  const errorObj = isRecord(payload["error"])
    ? (payload["error"] as Record<string, unknown>)
    : undefined;
  const nestedIssuePaths = errorObj?.["issuePaths"];
  if (isArray<unknown>(nestedIssuePaths)) {
    for (const p of nestedIssuePaths) push(p);
  }

  // 1) Zod standard: issues[] (direct)
  const issues = payload["issues"];
  if (isArray(issues)) {
    for (const it of issues) {
      const k = firstPathKey(it);
      if (k) out.add(k);
    }
  }
  // 1bis) Zod sous "error": error.issues[]
  const errorIssues = errorObj?.["issues"];
  if (isArray(errorIssues)) {
    for (const it of errorIssues) {
      const k = firstPathKey(it);
      if (k) out.add(k);
    }
  }

  // 2) Variante: errors[]
  const errors = payload["errors"];
  if (isArray(errors)) {
    for (const it of errors) {
      const k = firstPathKey(it);
      if (k) out.add(k);
    }
  }

  // 3) Zod format: fieldErrors: { field: [...] }
  const fieldErrors = payload["fieldErrors"];
  if (isRecord(fieldErrors)) {
    for (const k of Object.keys(fieldErrors)) out.add(k);
  }

  // 4) Fallback: objet simple { field: 'message' }
  //    (on évite de re-parcourir les clés déjà vues)
  if (isRecord(payload)) {
    for (const k of Object.keys(payload)) {
      // Ignore les clés déjà traitées plus haut
      if (
        k === "issuePaths" ||
        k === "issues" ||
        k === "errors" ||
        k === "error" ||
        k === "fieldErrors"
      ) {
        continue;
      }
      push(k);
    }
  }

  return Array.from(out);
}

/* ───────────────────────────── mapZodPathsToFieldErrors ───────────────────────────── */

/**
 * Mappe une liste (souple) de chemins vers un record "field -> message traduit".
 */
export function mapZodPathsToFieldErrors(
  pathsLike: unknown,
  translate: (key: string) => string,
  dict: Partial<Record<string, string>>
): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
  const paths: string[] = isArray<unknown>(pathsLike)
    ? (pathsLike.filter(isStrNum).map(String) as string[])
    : [];

  for (const p of paths) {
    const msgKey = dict[p];
    if (msgKey) out[p] = translate(msgKey);
  }
  return out;
}

/* ───────────────────────────── focusFirstInvalidField ───────────────────────────── */

// export function focusFirstInvalidField(
//   fields: Record<string, unknown>,
//   order: string[],
//   idMap: Record<string, string>
// ) {
//   const first = order.find((k) => Boolean(fields[k]));
//   if (!first) return;

//   const id = idMap[first];
//   if (!id) return;

//   const el = document.getElementById(id) as HTMLInputElement | null;
//   if (!el) return;

//   el.focus();
//   el.scrollIntoView({ behavior: "smooth", block: "center" });
//   try {
//     el.setSelectionRange?.(0, el.value.length);
//   } catch {
//     /* no-op */
//   }
// }
