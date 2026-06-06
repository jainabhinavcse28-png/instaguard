import { AlertTriangle, ShieldCheck, CheckCircle2, RefreshCw, Sparkles, AlertCircle, Info, ArrowUpRight } from "lucide-react";
import { ProfileAnalysisResult } from "../types";

interface AuditReportProps {
  result: ProfileAnalysisResult;
  username: string;
  onReset: () => void;
}

export default function AuditReport({ result, username, onReset }: AuditReportProps) {
  const {
    botScore,
    riskCategory,
    verdict,
    engagementRate,
    engagementStatus,
    flags,
    patternsDetected,
    recommendations,
  } = result;

  // Compute ring colors based on risk
  const getRiskColor = (cat: string) => {
    switch (cat) {
      case "HIGH":
        return {
          text: "text-red-500",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          stroke: "#ef4444",
          badge: "bg-red-500/20 text-red-300 border-red-500/30",
        };
      case "MEDIUM":
        return {
          text: "text-amber-500",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          stroke: "#f59e0b",
          badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        };
      default:
        return {
          text: "text-emerald-500",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          stroke: "#10b981",
          badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        };
    }
  };

  const style = getRiskColor(riskCategory);

  // SVG parameters for circular meter
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (botScore / 100) * circumference;

  return (
    <div className="space-y-6" id="audit-report-card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-800 gap-4">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Inspection Complete</span>
          <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2 mt-1">
            <span>Audit Result for:</span>
            <span className="text-pink-400">@{username}</span>
          </h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-800 border border-slate-700/80 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-lg transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* Main Score & Core Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ring Gauge Box */}
        <div className={`bg-slate-900 border ${style.border} rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4`}>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bot Probability Score</span>
          
          <div className="relative flex items-center justify-center h-36 w-36">
            {/* SVG circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke={style.stroke}
                fill="transparent"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-black text-white">{botScore}%</span>
              <span className={`block text-[10px] font-bold uppercase mt-0.5 px-2 py-0.5 rounded-full border ${style.badge}`}>
                {riskCategory} RISK
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            {botScore > 70 
              ? "Extremely high indicators of automated or coordinated activity." 
              : botScore > 30 
              ? "Mild activity anomalies, exercise normal vigilance." 
              : "Parameters suggest standard human organic traits."}
          </div>
        </div>

        {/* Verdict Details Box */}
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 md:col-span-2 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4.5 w-4.5 text-pink-500" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Security Diagnosis</span>
            </div>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
              "{verdict}"
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-800/80">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-900">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Engagement Rate</span>
              <span className="text-lg font-extrabold text-slate-200 mt-1 block">
                {engagementRate.toFixed(2)}%
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-900">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Engagement Credibility</span>
              <span className={`text-xs font-extrabold mt-1.5 flex items-center space-x-1 ${
                engagementStatus === "NORMAL" ? "text-emerald-400" : "text-amber-400"
              }`}>
                {engagementStatus === "NORMAL" ? (
                  <CheckCircle2 className="h-3.5 w-3.5 inline" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 inline" />
                )}
                <span>{engagementStatus}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Flag Inspections & Remediation Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Warning Flags */}
        <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 space-y-4">
          <h4 className="text-sm font-bold text-slate-200 flex items-center space-x-1.5 border-b border-slate-800 pb-2">
            <AlertTriangle className="h-4.5 w-4.5 text-pink-500" />
            <span>Warning Flags Count Details ({flags.length})</span>
          </h4>

          {flags.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              <ShieldCheck className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
              No warnings or suspicious signatures flagged for this profile.
            </div>
          ) : (
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {flags.map((flag, index) => {
                const isHigh = flag.severity === "HIGH";
                const isMed = flag.severity === "MEDIUM";
                return (
                  <div
                    key={index}
                    className={`p-3.5 rounded-xl border flex gap-3 ${
                      isHigh
                        ? "bg-red-500/5 border-red-500/10"
                        : isMed
                        ? "bg-amber-500/5 border-amber-500/10"
                        : "bg-slate-950 border-slate-850"
                    }`}
                  >
                    <div className="mt-0.5">
                      <div className={`h-2.5 w-2.5 rounded-full ${
                        isHigh ? "bg-red-500 animate-pulse" : isMed ? "bg-amber-500" : "bg-blue-500"
                      }`} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-200 block">
                        {flag.title}
                      </span>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        {flag.description}
                      </p>
                      {flag.indicator && (
                        <div className="flex items-center space-x-1 mt-1 text-[10px] font-mono text-slate-500 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-850 w-fit">
                          <Info className="h-3 w-3 flex-shrink-0" />
                          <span>Indicator: {flag.indicator}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Dynamic Action Plans */}
        <div className="space-y-6">
          {/* Patterns Block */}
          <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-slate-300">Detected Botanical/Behavioral Patterns</h4>
            <div className="flex flex-wrap gap-2">
              {patternsDetected.map((pat, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300 rounded-lg flex items-center space-x-1"
                >
                  <span className="h-1 w-1 bg-pink-500 rounded-full"></span>
                  <span>{pat}</span>
                </span>
              ))}
              {patternsDetected.length === 0 && (
                <span className="text-xs text-slate-500 font-medium">None noted</span>
              )}
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Security Recommendations</span>
            <div className="space-y-2">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                  <span className="text-emerald-400 font-extrabold mt-0.5">✓</span>
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
              {recommendations.length === 0 && (
                <div className="text-xs text-slate-400 leading-relaxed flex items-center space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span>No security remediation required. General interaction is safe.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
