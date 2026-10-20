import { promises as fs } from "node:fs";
import path from "node:path";

export type Role = "farmer" | "officer";

export type StoredUser = {
  email: string;
  name: string;
  role: Role;
  passwordHash?: string;
  provider: "credentials" | "google";
  createdAt: string;
  extensionRequested?: boolean;
  farmDetails?: string;
};

export type SavedReport = {
  id: string;
  userEmail: string;
  crop: string;
  symptoms: string[];
  symptomLabels: string[];
  diagnosis: {
    id: string;
    conditionName: string;
    conditionNameSw: string;
    type: string;
    severity: string;
  };
  language: "en" | "sw";
  coordinates: { latitude: number; longitude: number } | null;
  notes?: string;
  createdAt: string;
};

const USER_PREFIX = "gideon:user:";
const REPORT_PREFIX = "gideon:report:";
const INDEX_PREFIX = "gideon:reports:";

type MemoryStore = Map<string, unknown>;

const globalForStore = globalThis as unknown as { __gideonStore?: MemoryStore };

function memory(): MemoryStore {
  if (!globalForStore.__gideonStore) {
    globalForStore.__gideonStore = new Map<string, unknown>();
  }
  return globalForStore.__gideonStore;
}

function kvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function readKey<T>(key: string): Promise<T | null> {
  if (kvConfigured()) {
    try {
      const { kv } = await import("@vercel/kv");
      return (await kv.get<T>(key)) ?? null;
    } catch (error) {
      console.error("[gideon] KV read failed, falling back to file store", error);
    }
  }
  return (memory().get(key) as T | undefined) ?? null;
}

async function writeKey(key: string, value: unknown): Promise<void> {
  if (kvConfigured()) {
    try {
      const { kv } = await import("@vercel/kv");
      await kv.set(key, value);
      return;
    } catch (error) {
      console.error("[gideon] KV write failed, falling back to file store", error);
    }
  }
  memory().set(key, value);
}

/**
 * Development and light traffic fallback. Vercel KV is the production store;
 * when it is not configured reports are kept in the local .data directory so
 * the app stays usable on a laptop with no cloud services.
 */
const localDir = path.join(process.cwd(), ".data");

async function localFile<T>(name: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(path.join(localDir, name), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function writeLocalFile(name: string, value: unknown): Promise<void> {
  await fs.mkdir(localDir, { recursive: true });
  await fs.writeFile(path.join(localDir, name), JSON.stringify(value, null, 2), "utf8");
}

export async function getUser(email: string): Promise<StoredUser | null> {
  const normalised = email.trim().toLowerCase();
  const stored = await readKey<StoredUser>(`${USER_PREFIX}${normalised}`);
  if (stored) return stored;
  const fallback = await localFile<StoredUser>(`user-${normalised}.json`);
  return fallback ?? null;
}

export async function saveUser(user: StoredUser): Promise<StoredUser> {
  const normalised = { ...user, email: user.email.trim().toLowerCase() };
  await writeKey(`${USER_PREFIX}${normalised.email}`, normalised);
  try {
    await writeLocalFile(`user-${normalised.email}.json`, normalised);
  } catch (error) {
    console.error("[gideon] local user cache write failed", error);
  }
  return normalised;
}

export async function setUserRole(email: string, role: Role): Promise<StoredUser | null> {
  const user = await getUser(email);
  if (!user) return null;
  return saveUser({ ...user, role, extensionRequested: role === "officer" ? false : user.extensionRequested });
}

export async function saveReport(report: SavedReport): Promise<SavedReport> {
  await writeKey(`${REPORT_PREFIX}${report.id}`, report);
  const existing = (await getReportIds(report.userEmail)) || [];
  const next = [report.id, ...existing.filter((id) => id !== report.id)].slice(0, 500);
  await writeKey(`${INDEX_PREFIX}${report.userEmail.toLowerCase()}`, next);

  const localReports = (await localFile<SavedReport[]>(`reports-${report.userEmail.toLowerCase()}.json`)) || [];
  const merged = [report, ...localReports.filter((item) => item.id !== report.id)].slice(0, 500);
  try {
    await writeLocalFile(`reports-${report.userEmail.toLowerCase()}.json`, merged);
  } catch (error) {
    console.error("[gideon] local report cache write failed", error);
  }
  return report;
}

async function getReportIds(email: string): Promise<string[]> {
  const index = await readKey<string[]>(`${INDEX_PREFIX}${email.trim().toLowerCase()}`);
  if (index) return index;
  const local = await localFile<SavedReport[]>(`reports-${email.toLowerCase()}.json`);
  return local ? local.map((report) => report.id) : [];
}

export async function listReports(email: string): Promise<SavedReport[]> {
  const ids = await getReportIds(email);
  const fromStore = await Promise.all(ids.map((id) => readKey<SavedReport>(`${REPORT_PREFIX}${id}`)));
  const found = fromStore.filter((report): report is SavedReport => Boolean(report));
  if (found.length > 0) {
    return found.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const local = (await localFile<SavedReport[]>(`reports-${email.toLowerCase()}.json`)) || [];
  return local.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getReport(email: string, id: string): Promise<SavedReport | null> {
  const report = await readKey<SavedReport>(`${REPORT_PREFIX}${id}`);
  if (report && report.userEmail.toLowerCase() === email.toLowerCase()) return report;
  const local = (await localFile<SavedReport[]>(`reports-${email.toLowerCase()}.json`)) || [];
  return local.find((item) => item.id === id) ?? null;
}
