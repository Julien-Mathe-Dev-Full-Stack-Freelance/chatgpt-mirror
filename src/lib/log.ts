/**
 * @file src/lib/log.ts
 * @intro Nano-logger isomorphe (client + serveur)
 * @description
 * API minimale, stable et extensible :
 * - `log.debug|info|warn|error(message, ctx?)`
 * - `log.child(ctx)` pour préfixer un contexte (ns, feature, route…)
 * - `log.setContext(ctx)` pour un contexte global léger (ex: app, version)
 *
 * Côté serveur → sortie JSON line (ingérable tel quel par un collecteur plus tard)
 * Côté client  → sortie lisible (message + contexte)
 *
 * @env NEXT_PUBLIC_LOG_LEVEL : "debug" | "info" | "warn" | "error" (défaut: "info")
 *
 * @layer lib/core
 * @remarks
 * - Volontairement simple : 1 fichier, 0 dépendance.
 * - Prêt à “scaler” : on pourra brancher Sentry/Axiom en remplaçant `emit()`.
 * - Pense à **masquer** les clés sensibles si tu en logges (voir `SENSITIVE_KEYS`).
 */

type Level = "debug" | "info" | "warn" | "error";
const LEVELS = ["debug", "info", "warn", "error"] as const;

/** Détecte l’environnement d’exécution une seule fois (évite le coût dans emit). */
const IS_SERVER = typeof window === "undefined";

/** Normalise et sécurise le niveau minimal (fallback => "info"). */
const ENV_LEVEL = String(
  process.env["NEXT_PUBLIC_LOG_LEVEL"] ?? "info"
).toLowerCase();
const MIN: Level = (LEVELS as readonly string[]).includes(ENV_LEVEL)
  ? (ENV_LEVEL as Level)
  : "info";
const MIN_IDX = (LEVELS as readonly string[]).indexOf(MIN);

/** Contexte global (léger) injecté à chaque ligne (ex: app, version, env). */
let baseCtx: Record<string, unknown> = {};

/** Clés qui seront masquées si présentes dans un contexte. */
const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "authorization",
  "secret",
]);

/**
 * Met à jour (merge) le contexte global ajouté à chaque log.
 * Non destructif : ajoute/écrase clé par clé.
 * @param ctx Contexte à fusionner.
 * @returns void
 */
function setLogContext(ctx: Record<string, unknown>): void {
  baseCtx = { ...baseCtx, ...ctx };
}

/**
 * Indique si un niveau doit être émis selon le seuil courant.
 * @param lvl Niveau de log.
 * @returns `true` si le log doit être émis, sinon `false`.
 */
function shouldLog(lvl: Level): boolean {
  return (LEVELS as readonly string[]).indexOf(lvl) >= MIN_IDX;
}

/**
 * Masque quelques clés sensibles dans un contexte (shallow).
 * @param obj Contexte (optionnel).
 * @returns Contexte redigéré (ou `undefined` si `obj` falsy).
 */
function redact(obj?: Record<string, unknown>) {
  if (!obj) return obj;
  return redactValue(obj, new WeakSet<object>()) as Record<string, unknown>;
}

function redactValue(value: unknown, seen: WeakSet<object>): unknown {
  if (value === null) {
    return null;
  }

  if (typeof value !== "object") {
    return value;
  }

  const isArray = Array.isArray(value);
  const container = value as Record<string, unknown>;

  if (seen.has(container)) {
    return isArray ? [] : {};
  }
  seen.add(container);

  if (isArray) {
    return (value as ReadonlyArray<unknown>).map((item) =>
      redactValue(item, seen)
    );
  }

  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(container)) {
    out[key] = SENSITIVE_KEYS.has(key.toLowerCase())
      ? "***"
      : redactValue(val, seen);
  }
  return out;
}

/**
 * Émission réelle du log (via console.*).
 * Point d’extension futur pour relayer vers un SaaS (Sentry/Axiom…).
 * @param lvl Niveau.
 * @param msg Message court (clé).
 * @param ctx Contexte additionnel (sera fusionné au contexte global).
 * @returns void
 */
function emit(lvl: Level, msg: string, ctx?: Record<string, unknown>): void {
  if (!shouldLog(lvl)) return;

  // On redige à la fois le contexte global et le contexte ad-hoc.
  const mergedCtx = { ...redact(baseCtx), ...redact(ctx) };

  const record = {
    level: lvl,
    msg,
    time: new Date().toISOString(),
    ...mergedCtx,
  };

  if (IS_SERVER) {
    // Serveur → JSON line
    const line = JSON.stringify(record);
    switch (lvl) {
      case "debug":
        console.debug(line);
        break;
      case "info":
        console.info(line);
        break;
      case "warn":
        console.warn(line);
        break;
      case "error":
        console.error(line);
        break;
      default:
        console.log(line);
    }
  } else {
    // Client → message lisible + contexte
    switch (lvl) {
      case "debug":
        console.debug(msg, mergedCtx);
        break;
      case "info":
        console.info(msg, mergedCtx);
        break;
      case "warn":
        console.warn(msg, mergedCtx);
        break;
      case "error":
        console.error(msg, mergedCtx);
        break;
      default:
        console.log(msg, mergedCtx);
    }
  }
}

/**
 * Crée un enfant avec un contexte préfixé (pattern “child logger”).
 * @param extra Contexte ajouté à tous les logs de l’enfant.
 * @returns Logger enfant avec la même API (debug/info/warn/error/child).
 */
function child(extra: Record<string, unknown>) {
  const merge = (c?: Record<string, unknown>) => ({ ...extra, ...(c ?? {}) });
  return {
    debug: (m: string, c?: Record<string, unknown>) =>
      emit("debug", m, merge(c)),
    info: (m: string, c?: Record<string, unknown>) => emit("info", m, merge(c)),
    warn: (m: string, c?: Record<string, unknown>) => emit("warn", m, merge(c)),
    error: (m: string, c?: Record<string, unknown>) =>
      emit("error", m, merge(c)),
    child: (more: Record<string, unknown>) => child({ ...extra, ...more }),
  };
}

/**
 * Façade publique — logger racine.
 */
export const log = {
  debug: (m: string, c?: Record<string, unknown>) => emit("debug", m, c),
  info: (m: string, c?: Record<string, unknown>) => emit("info", m, c),
  warn: (m: string, c?: Record<string, unknown>) => emit("warn", m, c),
  error: (m: string, c?: Record<string, unknown>) => emit("error", m, c),
  child,
  setContext: setLogContext,
};

export async function logWithDuration<T>(
  label: string,
  fn: () => Promise<T> | T
): Promise<T> {
  const started = Date.now();
  log.debug(`${label}.start`);
  try {
    return await fn();
  } finally {
    log.debug(`${label}.end`, { ms: Date.now() - started });
  }
}
