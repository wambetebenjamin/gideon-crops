import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { auth } from "@/auth";
import { saveReport, type SavedReport } from "@/lib/store";
import { getCondition } from "@/lib/symptoms";

const schema = z.object({
  crop: z.string().min(2).max(40),
  symptoms: z.array(z.string().min(1).max(60)).min(1).max(20),
  symptomLabels: z.array(z.string().min(1).max(80)).max(20).optional(),
  diagnosisId: z.string().min(2).max(80),
  language: z.enum(["en", "sw"]).default("en"),
  coordinates: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    })
    .nullable()
    .optional(),
  notes: z.string().max(600).optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: "Sign in to save a report." }, { status: 401 });
  }
  if (session.user.role !== "officer") {
    return NextResponse.json(
      { ok: false, error: "Only verified extension officers can save reports." },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "The report data was incomplete.", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const entry = getCondition(parsed.data.diagnosisId);
  if (!entry) {
    return NextResponse.json({ ok: false, error: "That diagnosis is not in the database." }, { status: 404 });
  }

  const report: SavedReport = {
    id: randomUUID(),
    userEmail: session.user.email,
    crop: parsed.data.crop,
    symptoms: parsed.data.symptoms,
    symptomLabels: parsed.data.symptomLabels ?? parsed.data.symptoms,
    diagnosis: {
      id: entry.id,
      conditionName: entry.conditionName.en,
      conditionNameSw: entry.conditionName.sw,
      type: entry.type,
      severity: entry.severity,
    },
    language: parsed.data.language,
    coordinates: parsed.data.coordinates ?? null,
    notes: parsed.data.notes,
    createdAt: new Date().toISOString(),
  };

  await saveReport(report);

  return NextResponse.json({ ok: true, report });
}
