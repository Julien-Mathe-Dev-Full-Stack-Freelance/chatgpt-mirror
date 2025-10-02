/**
 * @file src/app/api/admin/media/upload/route.ts
 * @intro API admin — Upload d’images (local-only)
 * @layer api/routes
 * @description
 * - POST /api/admin/media/upload (multipart/form-data)
 * - Écrit le fichier en local dans `public/uploads/YYYY/MM/`
 * - Retourne l’URL **relative** pour l’UI : { url, filename, size, contentType }
 * - ⚠️ Conçu pour l’environnement local/dev. En prod (SaaS), utiliser un stockage dédié.
 */

import { join, extname } from "node:path";

import { handleRoute } from "@/lib/api/handle-route";
import { throwHttp } from "@/lib/http/validation";
import { ensureDirForFile, writeFileAtomic } from "@/infrastructure/utils/fs";
import { log } from "@/lib/log";

// --- Constantes locales (pas de strings “magiques”)
const UPLOADS_ROOT =
  process.env["PUBLIC_UPLOADS_DIR"] ?? join(process.cwd(), "public", "uploads");

const MAX_IMAGE_UPLOAD_BYTES = Number(
  process.env["MAX_IMAGE_UPLOAD_BYTES"] ?? 5_000_000
); // 5MB

const IMAGE_MIME_PREFIX = "image/";

// Nom de fichier sûr: letters/digits/.-_ ; remplace espaces & autres par '-'
function sanitizeFilename(name: string): string {
  const base = name.normalize("NFKC").toLowerCase().replace(/\s+/g, "-");
  return base.replace(/[^a-z0-9._-]/g, "-").replace(/-+/g, "-");
}

function nowParts(d = new Date()) {
  const y = String(d.getUTCFullYear());
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return { y, m };
}

function inferExtFromMime(mime: string): string {
  // basique: image/png → ".png"
  const parts = mime.split("/");
  return parts.length === 2 ? `.${parts[1]}` : "";
}

export async function POST(req: Request) {
  const NS = "api.admin.media.upload.POST" as const;
  return handleRoute(NS, req, async () => {
    const lg = log.child({ ns: NS });

    // 1) Lire form-data
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      throwHttp(400, { code: "BAD_REQUEST", message: "Missing file field" });
    }

    const contentType = String(file.type || "");
    const size = Number(file.size || 0);
    if (!contentType.startsWith(IMAGE_MIME_PREFIX)) {
      throwHttp(415, {
        code: "UNSUPPORTED_MEDIA_TYPE",
        message: "File must be an image/*",
      });
    }
    if (size <= 0) {
      throwHttp(400, { code: "EMPTY_FILE", message: "Empty file" });
    }
    if (size > MAX_IMAGE_UPLOAD_BYTES) {
      throwHttp(413, {
        code: "PAYLOAD_TOO_LARGE",
        message: `File too large (max ${Math.floor(
          MAX_IMAGE_UPLOAD_BYTES / 1024
        )}KB)`,
      });
    }

    // 2) Construire chemin de sortie
    const origName = file.name || "image";
    const safeBase = sanitizeFilename(origName.replace(/\.[^.]+$/, ""));
    const extFromName = extname(origName); // .png, .jpg...
    const extFromMime = inferExtFromMime(contentType);
    const finalExt = extFromName || extFromMime || ".bin";

    const { y, m } = nowParts();
    const filename = `${safeBase}-${Date.now()}${finalExt}`;
    const absPath = join(UPLOADS_ROOT, y, m, filename);

    // 3) Écrire
    await ensureDirForFile(absPath);
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFileAtomic(absPath, buf);

    // 4) URL publique relative (servie par Next via /public)
    const url = `/uploads/${y}/${m}/${filename}`;

    lg.debug("upload.ok", { contentType, size, url });

    return {
      url,
      filename,
      size,
      contentType,
    };
  });
}
