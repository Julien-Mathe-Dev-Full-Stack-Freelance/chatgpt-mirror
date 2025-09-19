/**
 * @file src/lib/zod-bootstrap.ts
 * @intro Bootstrap de Zod (config + types).
 * @description
 * - Permet de centraliser la configuration de Zod (messages, etc.).
 *
 * @layer lib/zod
 */

import { installZodErrorConfig } from "@/schemas/setup-zod";
installZodErrorConfig();
export {};
