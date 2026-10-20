import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getReport } from "@/lib/store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: "Sign in to view this report." }, { status: 401 });
  }

  const { id } = await context.params;
  const report = await getReport(session.user.email, id);

  if (!report) {
    return NextResponse.json({ ok: false, error: "Report not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, report });
}
