import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listReports } from "@/lib/store";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: "Sign in to view your reports." }, { status: 401 });
  }

  const reports = await listReports(session.user.email);

  return NextResponse.json({
    ok: true,
    count: reports.length,
    reports,
  });
}
