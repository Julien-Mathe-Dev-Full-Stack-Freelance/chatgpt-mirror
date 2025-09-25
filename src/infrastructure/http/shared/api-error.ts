/**
 * @file src/infrastructure/http/shared/api-error.ts
 * @intro Helpers pour gérer les erreurs HTTP (400/500) dans les routes.
 * @description
 * Gère les erreurs 400 et 500 pour les routes `/api/*`.
 * Les erreurs sont gérées via `notify.fromError(error)`.
 */
export type ApiErrorInit = {
  status?: number;
  code?: string | number;
  message?: string;
  url?: string;
  method?: string;
  body?: unknown;
  cause?: unknown;
};

export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string | number;
  readonly url?: string;
  readonly method?: string;
  readonly body?: unknown;

  constructor(init: ApiErrorInit) {
    super(init.message ?? "API request failed");
    this.name = "ApiError";
    this.status = init.status;
    this.code = init.code;
    this.url = init.url;
    this.method = init.method;
    this.body = init.body;
  }
}
