/**
 * @file src/infrastructure/http/admin/media.client.ts
 * @intro Client HTTP admin — Upload média
 * @layer infrastructure/http
 * @description
 * - POST multipart vers `/api/admin/media/upload`
 * - Retourne l’URL **relative** (ex: `/uploads/2025/09/<file>.png`)
 */

import { ENDPOINTS } from "@/infrastructure/constants/endpoints";
import { apiFetch } from "@/lib/http/api-fetch";

/** Réponse standard de l’API d’upload */
type MediaUploadResponseDTO = Readonly<{
  url: string; // URL relative publique (servie depuis /public)
  filename: string; // nom de fichier final
  size: number; // en octets
  contentType: string; // ex: image/png
}>;

/**
 * Upload d’une image (multipart/form-data).
 * @returns DTO avec l’URL relative publique.
 */
export async function uploadImage(
  file: File,
  opts?: RequestInit
): Promise<MediaUploadResponseDTO> {
  const fd = new FormData();
  fd.append("file", file, file.name);

  // apiFetch n’ajoute PAS Content-Type si body est un FormData (parfait pour multipart)
  return apiFetch<MediaUploadResponseDTO>(ENDPOINTS.ADMIN.MEDIA.upload, {
    method: "POST",
    body: fd,
    ...(opts ?? {}),
  });
}
