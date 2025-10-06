/**
 * @file i18n — Error messages mapped by ErrorCode (EN)
 * @remarks
 * - Partial map (Partial<Record<ErrorCode, string>>)
 * - Extend as needed; unmapped codes will fall back to a generic UI message.
 */

const enErrors = {
  // ---- Validation / shape (Zod, invalid payloads) ----
  VALIDATION_ERROR: "Some fields are invalid.",
  BAD_REQUEST: "Invalid request.",

  // ---- Auth / permissions ----
  UNAUTHORIZED: "You must be signed in to perform this action.",
  FORBIDDEN: "You don’t have permission to perform this action.",

  // ---- Resources / I/O ----
  NOT_FOUND: "Resource not found.",
  INTERNAL: "Unexpected internal error. Please try again later.",

  // ---- Media upload (/api/admin/media/upload) ----
  UNSUPPORTED_MEDIA_TYPE: "The file must be an image (image/*).",
  EMPTY_FILE: "The file is empty.",
  PAYLOAD_TOO_LARGE: "The file is too large.",
  IDENTITY_TITLE_REQUIRED_WHEN_NO_LOGO:
    "A title is required when no logo (light or dark) is provided.",
  // (Add more domain-specific codes here as needed)
} as const;

export default enErrors;
