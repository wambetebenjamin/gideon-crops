"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, CameraOff, ImageUp, RefreshCw, ScanLine, ShieldCheck } from "lucide-react";

type CameraState = "idle" | "starting" | "live" | "denied" | "unsupported" | "error";

export type CaptureQuality = {
  brightness: number;
  greenShare: number;
  verdict: "good" | "dark" | "blurry" | "unknown";
};

type CropScannerProps = {
  onCapture: (dataUrl: string, quality: CaptureQuality) => void;
  captured: string | null;
  onRetake: () => void;
};

function analyseFrame(data: Uint8ClampedArray): CaptureQuality {
  let total = 0;
  let green = 0;
  const step = 4 * 12; // sample every twelfth pixel, plenty for an exposure check
  let samples = 0;
  for (let i = 0; i < data.length; i += step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    total += 0.299 * r + 0.587 * g + 0.114 * b;
    if (g > r + 12 && g > b + 12) green += 1;
    samples += 1;
  }
  const brightness = samples ? total / samples : 0;
  const greenShare = samples ? green / samples : 0;
  let verdict: CaptureQuality["verdict"] = "good";
  if (brightness < 48) verdict = "dark";
  else if (greenShare < 0.08) verdict = "blurry";
  return { brightness: Math.round(brightness), greenShare, verdict };
}

export default function CropScanner({ onCapture, captured, onRetake }: CropScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<CameraState>("idle");
  const [message, setMessage] = useState("");

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => () => stopStream(), [stopStream]);

  const startCamera = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setState("unsupported");
      setMessage("This browser cannot open the camera. You can still choose a photo from your phone instead.");
      return;
    }
    setState("starting");
    setMessage("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
      setState("live");
    } catch (error) {
      const err = error as DOMException;
      if (err?.name === "NotAllowedError" || err?.name === "SecurityError") {
        setState("denied");
        setMessage("Camera permission was blocked. Allow camera access in the browser, or pick a photo instead.");
      } else if (err?.name === "NotFoundError" || err?.name === "OverconstrainedError") {
        setState("error");
        setMessage("No rear camera was found on this device. Choose a photo of the leaf instead.");
      } else {
        setState("error");
        setMessage("The camera could not start. Choose a photo of the leaf instead, the analysis still works.");
      }
    }
  }, []);

  const finishCapture = useCallback(
    (dataUrl: string, quality: CaptureQuality) => {
      stopStream();
      setState("idle");
      onCapture(dataUrl, quality);
    },
    [onCapture, stopStream],
  );

  const capture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 960;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, width, height);

    // The frame is read as ImageData for an on device exposure and leaf check.
    // Nothing is uploaded: the data URL never leaves this browser.
    const imageData = context.getImageData(0, 0, width, height);
    const quality = analyseFrame(imageData.data);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.86);
    finishCapture(dataUrl, quality);
  }, [finishCapture]);

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const scale = Math.min(1, 1280 / Math.max(img.width, img.height));
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const context = canvas.getContext("2d");
          if (!context) return;
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const quality = analyseFrame(imageData.data);
          finishCapture(canvas.toDataURL("image/jpeg", 0.86), quality);
        };
        img.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    },
    [finishCapture],
  );

  return (
    <div className="gc-scanner-card">
      <div className="gc-video-wrap">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          aria-label="Live camera view of the crop leaf"
          style={{ display: state === "live" && !captured ? "block" : "none" }}
        />
        {captured ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={captured} alt="Captured crop leaf" className="gc-snapshot" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : null}

        {!captured && (
          <svg className="gc-guide-svg" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
            <path
              className="gc-guide-frame"
              d="M60 120 V70 a10 10 0 0 1 10 -10 H120 M280 60 h50 a10 10 0 0 1 10 10 v50 M340 180 v50 a10 10 0 0 1 -10 10 h-50 M120 240 H70 a10 10 0 0 1 -10 -10 v-50"
            />
          </svg>
        )}

        {!captured && state !== "live" ? (
          <div className="gc-camera-placeholder">
            {state === "denied" || state === "unsupported" ? (
              <CameraOff size={44} color="#70c745" aria-hidden="true" />
            ) : (
              <Camera size={44} color="#70c745" aria-hidden="true" />
            )}
            <h5 style={{ color: "#ffffff", textTransform: "uppercase", marginBottom: 10 }}>
              {state === "starting" ? "Opening the camera" : "Point at the affected leaf"}
            </h5>
            <p>
              {message ||
                "Hold the phone about 20cm from the leaf, fill the frame with the damaged part and keep your shadow off the leaf."}
            </p>
            <button type="button" className="btn alazea-btn" onClick={startCamera} disabled={state === "starting"}>
              {state === "starting" ? "Starting" : "Start camera"}
            </button>
          </div>
        ) : null}

        {state === "live" && !captured ? (
          <span className="gc-camera-note">
            <ScanLine size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} aria-hidden="true" />
            Line the leaf up with the frame, then capture
          </span>
        ) : null}
      </div>

      <canvas ref={canvasRef} hidden aria-hidden="true" />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFile(file);
          event.target.value = "";
        }}
      />

      <div className="gc-camera-actions">
        {captured ? (
          <>
            <button type="button" className="btn alazea-btn" onClick={onRetake}>
              <RefreshCw size={16} style={{ marginRight: 8, verticalAlign: "-2px" }} aria-hidden="true" />
              Retake photo
            </button>
            <span className="gc-camera-status">Photo kept on this device only</span>
          </>
        ) : (
          <>
            <button type="button" className="btn alazea-btn" onClick={capture} disabled={state !== "live"}>
              <Camera size={16} style={{ marginRight: 8, verticalAlign: "-2px" }} aria-hidden="true" />
              Capture leaf
            </button>
            <button type="button" className="btn alazea-btn gc-btn-ghost" onClick={() => fileRef.current?.click()}>
              <ImageUp size={16} style={{ marginRight: 8, verticalAlign: "-2px" }} aria-hidden="true" />
              Choose a photo
            </button>
            <span className="gc-camera-status">
              <ShieldCheck size={15} style={{ marginRight: 6, verticalAlign: "-2px" }} aria-hidden="true" />
              No photo leaves your phone
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export function ScanProgress({ step }: { step: 1 | 2 | 3 }) {
  const steps = ["Capture the leaf", "Tick what you see", "Read the diagnosis"];
  return (
    <div className="d-flex flex-wrap mb-30" style={{ gap: 10 }}>
      {steps.map((label, index) => {
        const number = (index + 1) as 1 | 2 | 3;
        const active = number === step;
        const done = number < step;
        return (
          <motion.div
            key={label}
            initial={false}
            animate={{ scale: active ? 1 : 0.98 }}
            className="d-flex align-items-center"
            style={{
              gap: 8,
              padding: "8px 14px",
              borderRadius: 2,
              border: `1px solid ${active ? "#70c745" : "#ebebeb"}`,
              backgroundColor: active ? "rgba(112,199,69,0.08)" : "#ffffff",
              fontSize: 13,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 0.4,
              color: done || active ? "#303030" : "#b7b7b7",
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                backgroundColor: active || done ? "#70c745" : "#ebebeb",
                color: active || done ? "#ffffff" : "#707070",
              }}
            >
              {number}
            </span>
            {label}
          </motion.div>
        );
      })}
    </div>
  );
}
