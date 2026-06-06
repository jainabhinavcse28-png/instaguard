import React, { useState, useRef } from "react";
import { Upload, Camera, AlertTriangle, CheckCircle, ShieldAlert, Sparkles, RefreshCw, Eye, Info, Image as ImageIcon } from "lucide-react";
import { ScreenshotAnalysisResult } from "../types";

export default function VisionScanner() {
  const [dragActive, setDragActive] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScreenshotAnalysisResult | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Conversion of file to base64
  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, or WEBP).");
      return;
    }
    
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setImageBase64(base64);
      setImagePreview(base64);
      setResult(null);
    };
    reader.onerror = () => {
      setError("Error reading the image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleVisionAnalyze = async () => {
    if (!imageBase64) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze/screenshot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: imageBase64,
          mimeType: "image/png",
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze image.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during multimodal analyze.");
    } finally {
      setLoading(false);
    }
  };

  // Immediate 1-click sandbox simulated analysis triggers
  const triggerSimulatedSample = (presetType: "PROFILE" | "SPAM") => {
    setLoading(true);
    setError(null);
    setResult(null);

    // Simulate standard base64 layout preview
    const dummyProfileBase64 = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200' style='background:%230f172a; border-radius:12px;'><text x='20' y='40' fill='%23ec4899' font-size='16' font-family='sans-serif' font-weight='bold'>Instagram Profile (Scan Presets)</text><rect x='20' y='70' width='80' height='80' rx='40' fill='%231e293b'/><text x='120' y='95' fill='%23f1f5f9' font-size='14' font-family='sans-serif' font-weight='semibold'>@alex_crypto_wealth_994</text><text x='120' y='120' fill='%2394a3b8' font-size='12' font-family='sans-serif'>Followers: 120 | Following: 7,500</text></svg>";
    const dummySpamBase64 = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200' style='background:%230f172a; border-radius:12px;'><text x='20' y='40' fill='%23ec4899' font-size='16' font-family='sans-serif' font-weight='bold'>DM Conversation (Scan Presets)</text><text x='20' y='90' fill='%2364748b' font-size='12'>@kate_brand_ambassador:</text><text x='20' y='110' fill='%23f1f5f9' font-size='11' font-family='sans-serif'>&quot;Hey baby! 😍 Love your page. We want you as ambassador. DM main site @vogue_ltd!&quot;</text></svg>";

    setImagePreview(presetType === "PROFILE" ? dummyProfileBase64 : dummySpamBase64);
    
    setTimeout(() => {
      if (presetType === "PROFILE") {
        setResult({
          screenshotType: "PROFILE_PAGE",
          subjectUsername: "alex_crypto_wealth_994",
          detectedBotScore: 92,
          visualVerdict: "The image contains severe visual flags depicting a stock default picture alongside a devastating following ratios. The account follows the hard platform limit of 7,500 profiles while collecting fewer than 150 reciprocal followers, heavily indicative of mass cyber-follow spam scripts.",
          ocrExtractedBioOrText: "@alex_crypto_wealth_994, passive cashflows, 500% daily payout in BTC. Registered broker in Cyprus.",
          visualFlags: [
            { indicatorName: "Imbalanced Followers", evidenceSource: "Followers: 121 / Following: 7500", severity: "HIGH" },
            { indicatorName: "Adversarial Handle", evidenceSource: "Name ending with 3 trailing numbers", severity: "MEDIUM" },
            { indicatorName: "Financial Scammer Bio", evidenceSource: "Text pitch referencing BTC and brokers", severity: "HIGH" }
          ],
          recommendingActions: [
            "Block profile instantly using IG options",
            "Report for impersonation/financial scams",
            "Mute incoming comments matching similar keyword seeds"
          ]
        });
      } else {
        setResult({
          screenshotType: "DM_CONVERSATION",
          subjectUsername: "@kate_brand_ambassador",
          detectedBotScore: 85,
          visualVerdict: "The analyzed screenshot records classic automated solicitation outreach. Bots heavily copy-paste variations of model recruitment templates containing link hooks or tagging secondary aggregator networks (@vogue_ltd) to bypass active spam filters.",
          ocrExtractedBioOrText: "Hey baby! 😍 Love your page. We want you as ambassador. DM main site @vogue_ltd!",
          visualFlags: [
            { indicatorName: "Automated Bot Outreach Template", evidenceSource: "Recruitment keywords with multi-emojis", severity: "HIGH" },
            { indicatorName: "Profile Redirection Chain", evidenceSource: "Prompts to message an unverified external handle (@vogue_ltd)", severity: "HIGH" }
          ],
          recommendingActions: [
            "Decline or delete DM invite immediately",
            "Avoid interacting or clicking profile redirects",
            "Report message for spam solicitation"
          ]
        });
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-8" id="vision-scanner-wrapper">
      {/* Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Camera className="h-48 w-48 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full text-xs text-pink-400 font-semibold uppercase tracking-wider">
            Multimodal AI Analysis
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3 tracking-tight">
            Vision-Based Bot Screenshot Scanner
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 leading-relaxed">
            Upload custom screenshot image file of a suspicious Instagram Profile page, Comment Feed, or DM conversation. 
            Gemini reads OCR text, evaluates profile photos, measures layout metrics, and drafts a precise defense report.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Drop Picker Area */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Image Upload Portal</h4>

            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center space-y-3 ${
                dragActive
                  ? "border-pink-500 bg-pink-500/5 text-pink-400"
                  : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:bg-slate-950/60"
              }`}
              id="drop-target-area"
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              
              <div className="bg-slate-900 p-3 rounded-full border border-slate-800">
                <Upload className="h-5 w-5 text-slate-300" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-300">Drag & drop screenshot here</p>
                <p className="text-[10px] text-slate-500">or click to browse local files</p>
              </div>
            </div>

            {/* Simulated preset quick-views */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">No Screenshot? Run Preset Scans</span>
              
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  id="btn-raw-profile-vision"
                  onClick={() => triggerSimulatedSample("PROFILE")}
                  className="w-full text-left bg-slate-950 border border-slate-850 hover:border-slate-750 rounded-lg p-2.5 text-xs text-slate-300 hover:text-white transition-all flex items-center space-x-2"
                >
                  <span className="text-xs">👤</span>
                  <span>Inspect Bot Profile Showcase</span>
                </button>
                <button
                  type="button"
                  id="btn-raw-spam-vision"
                  onClick={() => triggerSimulatedSample("SPAM")}
                  className="w-full text-left bg-slate-950 border border-slate-850 hover:border-slate-755 rounded-lg p-2.5 text-xs text-slate-300 hover:text-white transition-all flex items-center space-x-2"
                >
                  <span className="text-xs">💬</span>
                  <span>Inspect Automated DM Outreach</span>
                </button>
              </div>
            </div>

            {/* Selected File Details */}
            {imagePreview && (
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Image Preview</span>
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setImageBase64(null);
                      setResult(null);
                    }}
                    className="text-[10px] text-slate-500 hover:text-pink-400 font-bold uppercase"
                  >
                    Clear
                  </button>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2">
                  <img src={imagePreview} alt="Target Scan" className="max-h-40 w-full object-contain rounded" />
                </div>
                
                <button
                  type="button"
                  onClick={handleVisionAnalyze}
                  disabled={loading || !imageBase64}
                  className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white font-bold py-2 px-4 rounded-lg text-xs tracking-wider transition"
                >
                  <span>{loading ? "Querying Vision Model..." : "Analyze Image Assets"}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Detailed reports column */}
        <div className="lg:col-span-2">
          {loading && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-6" id="vision-loading">
              <div className="h-12 w-12 rounded-full border-4 border-slate-800 border-t-pink-500 animate-spin flex items-center justify-center">
                <Camera className="h-5 w-5 text-pink-500 animate-pulse" />
              </div>
              <div className="space-y-2 max-w-sm">
                <h4 className="text-slate-200 font-bold text-sm">Vision OCR Scanner Triggered</h4>
                <p className="text-slate-400 text-xs leading-normal">
                  Transcribing text details, isolating bio strings, measuring layouts, and formulating artificial signatures using multi-modal visual heuristics.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-red-400 flex items-start space-x-3" id="vision-error">
              <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-100">Vision processing error</h4>
                <p className="text-xs text-red-300">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && !result && (
            <div className="bg-slate-900 border border-slate-850 border-dashed rounded-xl p-16 flex flex-col items-center justify-center text-center space-y-4 text-slate-500" id="vision-idle">
              <Sparkles className="h-10 w-10 text-slate-700" />
              <div className="max-w-sm space-y-1">
                <h4 className="text-slate-300 font-bold text-sm">Vision Diagnosis Clear</h4>
                <p className="text-xs text-slate-400">
                  Select a sandbox preset or upload a screenshot to activate the multimodal vision analysis deck.
                </p>
              </div>
            </div>
          )}

          {!loading && !error && result && (
            <div className="bg-slate-900 border border-slate-850 rounded-xl p-6 space-y-6" id="vision-result-card">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-800 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Screenshot Vision Assessment</span>
                  <h3 className="text-lg font-bold text-slate-200">
                    Subject Username: <span className="text-pink-400">{result.subjectUsername}</span>
                  </h3>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Bot Probability</span>
                  <div className="flex items-baseline justify-end space-x-1 mt-1">
                    <span className={`text-3xl font-black ${
                      result.detectedBotScore > 70 ? "text-red-400" : result.detectedBotScore > 35 ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      {result.detectedBotScore}%
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${
                    result.detectedBotScore > 70 ? "bg-red-500/15 border-red-500/25 text-red-400" : result.detectedBotScore > 35 ? "bg-amber-500/15 border-amber-500/25 text-amber-400" : "bg-emerald-500/15 border-emerald-500/25 text-emerald-400"
                  }`}>
                    {result.screenshotType}
                  </span>
                </div>
              </div>

              {/* Description Diagnosis */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Eye className="h-4 w-4 text-pink-500" />
                  <span>Visual Analysis Proof</span>
                </h4>
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-medium">
                  {result.visualVerdict}
                </p>
              </div>

              {/* OCR transcription area */}
              {result.ocrExtractedBioOrText && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">OCR Transcribed Text Details</span>
                  <div className="bg-slate-950 rounded-lg p-3 border border-slate-900 font-mono text-[11px] text-slate-300 select-all leading-normal whitespace-normal break-all">
                    {result.ocrExtractedBioOrText}
                  </div>
                </div>
              )}

              {/* Detected Visual flags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Visual Warnings</h4>
                  
                  <div className="space-y-2.5">
                    {result.visualFlags.map((flag, idx) => {
                      const isHigh = flag.severity === "HIGH";
                      return (
                        <div key={idx} className="border-b border-slate-900 pb-2 last:border-b-0 last:pb-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200">{flag.indicatorName}</span>
                            <span className={`text-[9px] font-bold px-1.5 rounded py-0.5 border ${
                              isHigh ? "bg-red-500/10 border-red-500/25 text-red-400" : "bg-slate-900 border-slate-800 text-slate-400"
                            }`}>
                              {flag.severity}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-normal flex items-start space-x-1">
                            <span className="text-pink-500">•</span>
                            <span>Evidence: {flag.evidenceSource}</span>
                          </p>
                        </div>
                      );
                    })}
                    {result.visualFlags.length === 0 && (
                      <div className="text-xs text-slate-500">No flags observed.</div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Recommended Countermeasures</h4>
                  
                  <div className="space-y-2">
                    {result.recommendingActions.map((act, idx) => (
                      <div key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                        <span className="text-pink-500 font-extrabold mt-0.5">✓</span>
                        <span className="leading-relaxed">{act}</span>
                      </div>
                    ))}
                    {result.recommendingActions.length === 0 && (
                      <div className="text-xs text-slate-400">Regular account safety applies.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
