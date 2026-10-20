#!/usr/bin/env node
/**
 * Grants the extension officer role to an existing account.
 *
 * An officer account is requested through the contact form. This script is the
 * manual step a site owner runs once the request has been checked, so no public
 * route can ever hand out the officer role.
 *
 * Usage:
 *   node scripts/grant-officer.mjs officer@example.com
 *
 * With KV_REST_API_URL and KV_REST_API_TOKEN set the record in Vercel KV is
 * updated. Otherwise the local .data folder used by `npm run dev` is updated.
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const email = (process.argv[2] || "").trim().toLowerCase();

if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  console.error("Usage: node scripts/grant-officer.mjs officer@example.com");
  process.exit(1);
}

const kvConfigured = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const key = `gideon:user:${email}`;
const localFile = path.join(process.cwd(), ".data", `user-${email}.json`);

async function readLocal() {
  try {
    return JSON.parse(await fs.readFile(localFile, "utf8"));
  } catch {
    return null;
  }
}

async function main() {
  if (kvConfigured) {
    const { kv } = await import("@vercel/kv");
    const user = await kv.get(key);
    if (!user) {
      console.error(`No account found for ${email} in Vercel KV.`);
      process.exit(1);
    }
    await kv.set(key, { ...user, role: "officer", extensionRequested: false });
    console.log(`${email} is now an extension officer (Vercel KV).`);
    return;
  }

  const user = await readLocal();
  if (!user) {
    console.error(`No local account found for ${email}. Looked for ${localFile}.`);
    console.error("Sign the officer up once, or run this with KV credentials set.");
    process.exit(1);
  }
  await fs.writeFile(
    localFile,
    JSON.stringify({ ...user, role: "officer", extensionRequested: false }, null, 2),
    "utf8",
  );
  console.log(`${email} is now an extension officer (local .data store).`);
  console.log("The account keeps its existing session; sign out and back in to pick up the new role.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
