/**
 * @file src/lib/http/read-json.ts
 * @intro Helpers de lecture JSON côté API.
 * @description
 * Fournit des helpers pour transformer une erreur Zod en réponse HTTP 400.
 *
 * @layer lib/http
 */

import { ERROR_CODES as EC } from "@/core/domain/errors/codes";
import { throwHttp } from "@/lib/http/validation";
/**
 * Lit le JSON du body de la requête (ou retourne une erreur 400 si invalide).
 * @param req - Requête HTTP.
 * @returns Le JSON du body ou une erreur 400.
 */
export async function readJsonOr400(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    throwHttp(400, {
      code: EC.VALIDATION_ERROR,
      issues: [{ path: "", message: "JSON invalide." }],
    });
  }
}

/**
 * Body JSON **optionnel**.
 * @param req - Requête HTTP.
 * @returns Le JSON du body ou `{}`.
 *
 */
export async function readJsonOptionalOrEmpty(req: Request): Promise<unknown> {
  try {
    const raw = await req.text();
    if (!raw || !raw.trim()) return {};
    return JSON.parse(raw);
  } catch {
    throwHttp(400, {
      code: EC.VALIDATION_ERROR,
      issues: [{ path: "", message: "JSON invalide." }],
    });
  }
}
