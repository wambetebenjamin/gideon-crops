import { NextResponse } from "next/server";
import { symptoms } from "@/lib/symptoms";
import { CROPS } from "@/lib/crops";

export const revalidate = 3600;

export async function GET() {
  const grouped = CROPS.map((crop) => {
    const conditions = symptoms.filter((entry) =>
      entry.affectedCrops.some((name) => name.toLowerCase() === crop.name.toLowerCase()),
    );
    return {
      slug: crop.slug,
      name: crop.name,
      swahiliName: crop.swahiliName,
      image: crop.image,
      conditionCount: conditions.length,
      conditions: conditions.map((entry) => ({
        id: entry.id,
        name: entry.conditionName.en,
        nameSw: entry.conditionName.sw,
        type: entry.type,
        severity: entry.severity,
        visualSymptoms: entry.visualSymptoms,
      })),
    };
  });

  return NextResponse.json(
    {
      ok: true,
      totalConditions: symptoms.length,
      cropCount: grouped.length,
      crops: grouped,
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
