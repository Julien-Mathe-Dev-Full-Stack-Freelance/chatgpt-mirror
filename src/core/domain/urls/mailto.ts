/**
 * @file src/core/domain/urls/mailto.ts
 * @intro mailto: — politique & parse
 * @layer domain/utils
 */

import { isSimpleEmail } from "@/core/domain/constants/web";

/**
 * Politique produit : autoriser mailto: sans destinataire (RFC 6068),
 * utile pour préremplir uniquement subject/body.
 */
const REQUIRE_MAILTO_RECIPIENT = false as const;

type ParsedMailto = {
  recipients: string[]; // emails validés (peut être vide selon policy)
  params: URLSearchParams; // subject, body, cc, bcc, etc.
};

export function parseMailto(href: string): ParsedMailto | null {
  try {
    const url = new URL(href);
    if (url.protocol !== "mailto:") return null;

    const raw = url.pathname ? decodeURIComponent(url.pathname) : "";
    const recipients = raw
      ? raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    for (const r of recipients) {
      if (!isSimpleEmail(r)) return null;
    }

    if (REQUIRE_MAILTO_RECIPIENT && recipients.length === 0) return null;

    return { recipients, params: url.searchParams };
  } catch {
    return null;
  }
}

export function isMailtoHref(href: string): boolean {
  return parseMailto(href) !== null;
}
