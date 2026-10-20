/**
 * The symptom database is the source of truth for both the bundled matcher and
 * the offline copy the service worker caches at /data/symptoms.json.
 * This keeps the public copy byte for byte identical to data/symptoms.json.
 */
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = join(root, "data", "symptoms.json");
const target = join(root, "public", "data", "symptoms.json");

await mkdir(dirname(target), { recursive: true });
await copyFile(source, target);
console.log("[gideon] copied data/symptoms.json to public/data/symptoms.json");
