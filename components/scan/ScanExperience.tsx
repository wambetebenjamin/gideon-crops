"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import CropScanner, { ScanProgress, type CaptureQuality } from "@/components/scan/CropScanner";
import SymptomSelector from "@/components/scan/SymptomSelector";
import ResultsPanel from "@/components/scan/ResultsPanel";
import SaveReportPanel from "@/components/scan/SaveReportPanel";
import { useScanStore } from "@/lib/scanStore";
import { matchSymptoms, type SymptomMatch } from "@/lib/symptomMatcher";
import { SYMPTOM_OPTIONS } from "@/lib/site";
import { localiseKey } from "@/lib/labels";

type Stage = "capture" | "symptoms" | "results";

const DEFAULT_CROP = "";

export default function ScanExperience({ initialCrop = DEFAULT_CROP }: { initialCrop?: string }) {
  const { crop, symptoms, language, setCrop, toggleSymptom, clearSymptoms, setLanguage } = useScanStore();
  const [stage, setStage] = useState<Stage>("capture");
  const [photo, setPhoto] = useState<string | null>(null);
  const [quality, setQuality] = useState<CaptureQuality | null>(null);
  const [matches, setMatches] = useState<SymptomMatch[]>([]);
  const [hasRun, setHasRun] = useState(false);

  const activeCrop = crop || initialCrop;

  const symptomLabels = useMemo(
    () => symptoms.map((key) => localiseKey(key, language)),
    [symptoms, language],
  );

  const handleCapture = (dataUrl: string, captureQuality: CaptureQuality) => {
    setPhoto(dataUrl);
    setQuality(captureQuality);
    setStage("symptoms");
  };

  const handleRetake = () => {
    setPhoto(null);
    setQuality(null);
    setStage("capture");
    setMatches([]);
    setHasRun(false);
  };

  const handleSubmit = () => {
    const result = matchSymptoms(activeCrop, symptoms, 3);
    setMatches(result);
    setHasRun(true);
    setStage("results");
  };

  const reset = () => {
    setPhoto(null);
    setQuality(null);
    setMatches([]);
    setHasRun(false);
    clearSymptoms();
    setStage("capture");
  };

  return (
    <div>
      <ScanProgress step={stage === "capture" ? 1 : stage === "symptoms" ? 2 : 3} />

      <div className="row">
        <div className="col-12 col-lg-6 mb-30">
          <CropScanner onCapture={handleCapture} captured={photo} onRetake={handleRetake} />

          {stage !== "capture" ? (
            <div className="d-flex flex-wrap align-items-center mt-15" style={{ gap: 10 }}>
              <button type="button" className="btn alazea-btn gc-manage-btn d-inline-flex align-items-center" onClick={reset} style={{ gap: 8 }}>
                <RotateCcw size={15} aria-hidden="true" /> Start a new scan
              </button>
              {stage === "results" ? (
                <button type="button" className="btn alazea-btn gc-manage-btn" onClick={() => setStage("symptoms")}>
                  Change symptoms
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="col-12 col-lg-6 mb-30">
          <AnimatePresence mode="wait">
            {stage === "capture" ? (
              <motion.div key="capture" className="gc-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h4 style={{ fontSize: 22, marginBottom: 10 }}>How the scan works</h4>
                <ol style={{ counterReset: "gc" }} className="gc-form-note" >
                  <li className="mb-10">Start the camera and let the app use the rear lens.</li>
                  <li className="mb-10">Fill the frame with the damaged part of the leaf and capture.</li>
                  <li className="mb-10">Tick the symptoms you can see and choose your crop.</li>
                  <li className="mb-0">Read the diagnosis and the treatment advice, in English or Kiswahili.</li>
                </ol>
                <div className="gc-alert gc-alert-info mt-20 mb-0">
                  The photo stays on your phone. The matcher reads a local symptom database, so no image and no cloud
                  model is involved.
                </div>
              </motion.div>
            ) : null}

            {stage === "symptoms" ? (
              <motion.div key="symptoms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SymptomSelector
                  crop={activeCrop}
                  symptoms={symptoms}
                  language={language}
                  quality={quality}
                  onCropChange={setCrop}
                  onToggle={toggleSymptom}
                  onSubmit={handleSubmit}
                />
              </motion.div>
            ) : null}

            {stage === "results" ? (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ResultsPanel
                  matches={matches}
                  crop={activeCrop}
                  language={language}
                  onLanguageChange={setLanguage}
                  symptomLabels={symptomLabels}
                >
                  {hasRun && matches[0] ? (
                    <SaveReportPanel
                      crop={activeCrop}
                      symptoms={symptoms}
                      symptomLabels={symptomLabels}
                      entry={matches[0].entry}
                      language={language}
                    />
                  ) : null}
                </ResultsPanel>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {matches.length === 0 && hasRun ? (
        <div className="gc-form-note mt-15">
          {SYMPTOM_OPTIONS.length} symptom options are available. Pick another combination and submit again.
        </div>
      ) : null}
    </div>
  );
}
