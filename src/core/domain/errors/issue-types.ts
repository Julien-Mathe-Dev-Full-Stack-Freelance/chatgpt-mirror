// src/core/domain/errors/issue-types.ts
import type { ErrorCode } from "@/core/domain/errors/codes";

export type IssuePath = ReadonlyArray<string | number>;

export type BlockingIssue = Readonly<{
  code: ErrorCode;
  path: IssuePath;
  meta?: Record<string, unknown>;
}>;

export type UiWarning<C extends string = string> = Readonly<{
  code: C; // codes locaux, non ErrorCode
  path?: IssuePath; // souvent pas nécessaire
  meta?: Record<string, unknown>;
}>;
