"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, Download, FileSearch, Leaf, MapPin, RefreshCw, Filter } from "lucide-react";
import type { SavedReport } from "@/lib/store";
import { SEVERITY_LABELS } from "@/lib/symptoms";
import { downloadReportPdf } from "@/lib/pdf";

type ReportsBrowserProps = {
  initialReports: SavedReport[];
  isOfficer: boolean;
};

const ALL = "all";

export default function ReportsBrowser({ initialReports, isOfficer }: ReportsBrowserProps) {
  const [reports, setReports] = useState<SavedReport[]>(initialReports);
  const [crop, setCrop] = useState(ALL);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const crops = useMemo(() => {
    const set = new Set(reports.map((report) => report.crop));
    return Array.from(set).sort();
  }, [reports]);

  const filtered = useMemo(() => {
    return reports.filter((report) => {
      if (crop !== ALL && report.crop !== crop) return false;
      const created = report.createdAt.slice(0, 10);
      if (from && created < from) return false;
      if (to && created > to) return false;
      return true;
    });
  }, [reports, crop, from, to]);

  const refresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/reports/list", { cache: "no-store" });
      const data = (await response.json()) as { ok?: boolean; reports?: SavedReport[] };
      if (data.ok && data.reports) setReports(data.reports);
    } finally {
      setRefreshing(false);
    }
  };

  const download = async (report: SavedReport) => {
    setBusyId(report.id);
    try {
      await downloadReportPdf(report);
    } finally {
      setBusyId(null);
    }
  };

  if (!isOfficer) {
    return (
      <div className="gc-empty-state">
        <FileSearch size={44} aria-hidden="true" />
        <h4 style={{ textTransform: "uppercase", fontSize: 22 }}>No saved reports yet</h4>
        <p style={{ maxWidth: 520, margin: "0 auto 24px" }}>
          Farmer accounts are read only, so nothing is stored from a scan. You can still open the scanner and read any
          diagnosis, and every scan works without an account.
        </p>
        <Link href="/scan" className="btn alazea-btn">
          Open the scanner
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="gc-panel mb-30">
        <div className="row align-items-end">
          <div className="col-12 col-md-4">
            <div className="gc-field">
              <label className="gc-label" htmlFor="gc-filter-crop">
                <Filter size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} aria-hidden="true" />
                Crop
              </label>
              <select id="gc-filter-crop" value={crop} onChange={(event) => setCrop(event.target.value)}>
                <option value={ALL}>All crops</option>
                {crops.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="gc-field">
              <label className="gc-label" htmlFor="gc-filter-from">
                From
              </label>
              <input id="gc-filter-from" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="gc-field">
              <label className="gc-label" htmlFor="gc-filter-to">
                To
              </label>
              <input id="gc-filter-to" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
            </div>
          </div>
          <div className="col-12 col-md-2">
            <button type="button" className="btn alazea-btn w-100" onClick={refresh} disabled={refreshing}>
              <RefreshCw size={15} className={refreshing ? "gc-spin" : undefined} style={{ marginRight: 6, verticalAlign: "-2px" }} aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>
        <p className="gc-form-note mt-15 mb-0">
          Showing {filtered.length} of {reports.length} saved reports.
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="gc-empty-state">
          <FileSearch size={44} aria-hidden="true" />
          <h4 style={{ textTransform: "uppercase", fontSize: 22 }}>
            {reports.length === 0 ? "No saved reports yet" : "No reports match that filter"}
          </h4>
          <p style={{ maxWidth: 540, margin: "0 auto 24px" }}>
            {reports.length === 0
              ? "Run a scan, read the diagnosis and choose Save report. The crop, the symptoms, the diagnosis and the date are stored on your officer account."
              : "Try a wider date range, or clear the crop filter to see everything you have saved."}
          </p>
          <Link href="/scan" className="btn alazea-btn">
            Scan a crop
          </Link>
        </div>
      ) : (
        <div className="row">
          {filtered.map((report, index) => (
            <div className="col-12 col-lg-6 mb-30" key={report.id}>
              <motion.article
                className="gc-report-row"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
              >
                <div className="d-flex flex-wrap align-items-center mb-10" style={{ gap: 8 }}>
                  <span className={`gc-badge gc-sev-${report.diagnosis.severity}`}>
                    {SEVERITY_LABELS[report.diagnosis.severity as keyof typeof SEVERITY_LABELS]?.en ?? report.diagnosis.severity}
                  </span>
                  <span className={`gc-badge gc-type-${report.diagnosis.type}`}>{report.diagnosis.type}</span>
                  <span className="gc-badge gc-badge-outline">{report.crop}</span>
                </div>

                <h5>{report.diagnosis.conditionName}</h5>
                <p className="gc-form-note mb-15" style={{ fontSize: 14 }}>
                  {report.diagnosis.conditionNameSw}
                </p>

                <div className="gc-report-meta">
                  <span>
                    <CalendarDays size={14} aria-hidden="true" />
                    {new Date(report.createdAt).toLocaleDateString("en-KE", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span>
                    <MapPin size={14} aria-hidden="true" />
                    {report.coordinates
                      ? `${report.coordinates.latitude.toFixed(4)}, ${report.coordinates.longitude.toFixed(4)}`
                      : "Location not shared"}
                  </span>
                  <span>
                    <Leaf size={14} aria-hidden="true" />
                    {report.symptomLabels.length} symptom{report.symptomLabels.length === 1 ? "" : "s"}
                  </span>
                </div>

                <p className="gc-form-note mb-15" style={{ fontSize: 14 }}>
                  {report.symptomLabels.join(", ")}
                </p>

                {report.notes ? (
                  <p style={{ fontSize: 14, marginBottom: 15, fontStyle: "italic" }}>&ldquo;{report.notes}&rdquo;</p>
                ) : null}

                <div className="d-flex flex-wrap align-items-center" style={{ gap: 10 }}>
                  <button
                    type="button"
                    className="btn alazea-btn d-inline-flex align-items-center"
                    onClick={() => download(report)}
                    disabled={busyId === report.id}
                    style={{ gap: 8, minWidth: 0, height: 42, lineHeight: 38 }}
                  >
                    <Download size={15} aria-hidden="true" />
                    {busyId === report.id ? "Preparing" : "Download PDF"}
                  </button>
                  <Link
                    href={`/scan?crop=${report.crop.toLowerCase()}`}
                    className="gc-form-note"
                    style={{ color: "#70c745", fontWeight: 600 }}
                  >
                    Scan this crop again
                  </Link>
                </div>
              </motion.article>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
