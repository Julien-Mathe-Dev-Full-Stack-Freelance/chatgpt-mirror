/**
 * @file src/infrastructure/utils/fs.ts
 * @intro Utilitaires FS partagés (ensure dir, write atomique, JSON robuste)
 * @layer infrastructure/fs
 */

import { promises as fs } from "node:fs";
import { dirname } from "node:path";

/** Crée le dossier parent du fichier (idempotent). */
export async function ensureDirForFile(filePath: string): Promise<void> {
  await fs.mkdir(dirname(filePath), { recursive: true });
}

/** Conversion générique vers Uint8Array pour satisfaire writeFile(FileHandle). */
function toUint8Array(view: NodeJS.ArrayBufferView): Uint8Array {
  return view instanceof Uint8Array
    ? view
    : new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
}

/** Écriture atomique: file.tmp-<pid>-<ts> → fsync → rename → fsync(dir) */
export async function writeFileAtomic(
  filePath: string,
  data: string | NodeJS.ArrayBufferView,
  encoding: BufferEncoding = "utf-8"
): Promise<void> {
  await ensureDirForFile(filePath);

  const tmp = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  const fh = await fs.open(tmp, "w");

  try {
    if (typeof data === "string") {
      await fh.writeFile(data, { encoding });
    } else {
      await fh.writeFile(toUint8Array(data)); // pas d'encoding pour les vues mémoire
    }
    await fh.sync(); // fsync le fichier tmp
  } finally {
    await fh.close();
  }

  await fs.rename(tmp, filePath);

  // fsync du dossier parent (meilleure durabilité ; ignore erreurs Windows)
  try {
    const dir = await fs.open(dirname(filePath), "r");
    try {
      await dir.sync();
    } finally {
      await dir.close();
    }
  } catch {
    /* noop (Windows) */
  }
}

/** Erreur dédiée quand un JSON disque est invalide. */
export class InvalidJsonFileError extends Error {
  readonly path: string;
  constructor(path: string, cause?: unknown) {
    super(`Invalid JSON at ${path}`);
    this.name = "InvalidJsonFileError";
    this.path = path;
    if (cause instanceof Error) this.stack = cause.stack;
  }
}

/** Lit + parse du JSON, avec erreur claire si invalide. */
export async function readJsonFile<T = unknown>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8");
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    throw new InvalidJsonFileError(filePath, err);
  }
}
