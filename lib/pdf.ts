"use client";

import type { SavedReport } from "@/lib/store";

/**
 * jsPDF is imported at click time so the scanner stays light on a farmer's
 * phone. The PDF is generated on the device and never uploaded anywhere.
 */
export async function downloadReportPdf(report: SavedReport): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 64;

  doc.setFillColor(112, 199, 69);
  doc.rect(0, 0, pageWidth, 92, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Gideon Crops", margin, 46);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Scan your crop. Know the problem. Act fast.", margin, 66);
  doc.text("+254 112 272 061  |  Kenya and East Africa", margin, 82);

  y = 130;
  doc.setTextColor(48, 48, 48);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Scan report", margin, y);
  y += 24;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const meta = [
    `Report ID: ${report.id}`,
    `Date: ${new Date(report.createdAt).toLocaleString("en-KE")}`,
    `Crop: ${report.crop}`,
    `Owner: ${report.userEmail}`,
    `Language used: ${report.language === "sw" ? "Kiswahili" : "English"}`,
  ];
  meta.forEach((line) => {
    doc.text(line, margin, y);
    y += 17;
  });

  y += 12;
  doc.setDrawColor(235, 235, 235);
  doc.line(margin, y, pageWidth - margin, y);
  y += 26;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Primary diagnosis", margin, y);
  y += 20;
  doc.setFontSize(15);
  doc.text(report.diagnosis.conditionName, margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`${report.diagnosis.type}  |  severity: ${report.diagnosis.severity}`, margin, y);
  y += 16;
  doc.text(`Kiswahili: ${report.diagnosis.conditionNameSw}`, margin, y);
  y += 26;

  const observed = report.symptomLabels.length > 0 ? report.symptomLabels.join(", ") : "none recorded";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Symptoms reported", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const symptomLines = doc.splitTextToSize(observed, pageWidth - margin * 2);
  doc.text(symptomLines, margin, y);
  y += symptomLines.length * 15 + 16;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("GPS location", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(
    report.coordinates
      ? `${report.coordinates.latitude.toFixed(5)}, ${report.coordinates.longitude.toFixed(5)}`
      : "Not shared for this scan",
    margin,
    y,
  );
  y += 26;

  if (report.notes) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Field notes", margin, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const notes = doc.splitTextToSize(report.notes, pageWidth - margin * 2);
    doc.text(notes, margin, y);
    y += notes.length * 15 + 16;
  }

  doc.setFontSize(9);
  doc.setTextColor(112, 112, 112);
  doc.text(
    doc.splitTextToSize(
      "This report was produced on the farmer's device from a local symptom database. It is guidance only and does not replace an extension officer's field inspection. Confirm any chemical rate with your local agro dealer or extension officer.",
      pageWidth - margin * 2,
    ),
    margin,
    y + 10,
  );

  doc.save(`gideon-crops-report-${report.id.slice(0, 8)}.pdf`);
}
