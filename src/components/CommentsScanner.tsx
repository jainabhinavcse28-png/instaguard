import React, { useState } from "react";
import { MessageSquare, AlertTriangle, ShieldCheck, CheckCircle, Sparkles, RefreshCw, Wand2, Info } from "lucide-react";
import { AuditedComment, CommentsAnalysisResult, SAMPLE_COMMENT_BLOCKS } from "../types";

export default function CommentsScanner() {
  const [commentsText, setCommentsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CommentsAnalysisResult | null>(null);

  const applyPreset = (text: string) => {
    setCommentsText(text);
    setResult(null);
    setError(null);
  };

  const clearInput = () => {
    setCommentsText("");
    setResult(null);
    setError(null);
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentsText.trim()) {
      setError("Please paste or generate some comments to audit first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentsText }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to scan commented lines.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during comment scanning.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case "LEGITIMATE":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400",
          dot: "bg-emerald-400",
          lbl: "Legitimate User",
        };
      case "CRYPTO_SCAM":
        return {
          bg: "bg-red-500/15 border-red-500/30 text-red-400 font-bold",
          dot: "bg-red-400 animate-ping",
          lbl: "Crypto/Forex Scam Bot",
        };
      case "COLLAB_SPAM":
        return {
          bg: "bg-amber-500/10 border-amber-500/25 text-amber-400",
          dot: "bg-amber-400",
          lbl: "Collab Recruiter Bot",
        };
      case "EMOJI_BOT":
        return {
          bg: "bg-purple-500/10 border-purple-500/25 text-purple-400",
          dot: "bg-purple-400",
          lbl: "Emoji Pod Bot",
        };
      default:
        return {
          bg: "bg-slate-800 border-slate-700 text-slate-300",
          dot: "bg-slate-400",
          lbl: "Suspicious Activity",
        };
    }
  };

  return (
    <div className="space-y-8" id="comments-scanner-wrapper">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <MessageSquare className="h-48 w-48 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-amber-500 rounded-full text-[10px] text-white font-bold uppercase tracking-wider">
            Bulk Comment Classifier
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3 tracking-tight">
            Coordinated Comment Spam Scanner
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 leading-relaxed">
            Copy and paste comments from any recent upload, or test with predefined scam structures. 
            The system isolates toxic cryptocurrency recruitments, false affiliate searches, and engagement pods.
          </p>
        </div>
      </div>

      {/* Experimental presets */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
          <Wand2 className="h-4 w-4 text-pink-400" />
          <span>Select Benchmark Comment Targets</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="comment-preset-grid">
          {SAMPLE_COMMENT_BLOCKS.map((p, idx) => (
            <button
              key={idx}
              id={`comment-preset-btn-${idx}`}
              onClick={() => applyPreset(p.text)}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-750 p-4 rounded-xl text-left transition-all duration-150 flex flex-col justify-between h-28 space-y-2 group"
            >
              <div className="font-bold text-slate-200 text-xs truncate group-hover:text-pink-400 w-full">
                {p.label}
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-2 italic leading-relaxed">
                "{p.text.split("\n")[0]}..."
              </div>
              <span className="text-[9px] text-pink-400 font-extrabold uppercase tracking-widest block pt-1">
                Load Preset →
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Bulk Area Left */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="text-sm font-bold text-slate-200">Paste Feed Content</h4>
            <button
              onClick={clearInput}
              className="text-[10px] text-slate-400 hover:text-pink-400 transition-colors uppercase font-bold"
            >
              Clear Input
            </button>
          </div>

          <form onSubmit={handleScan} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                Raw Comment Blocks
              </label>
              <textarea
                name="commentsText"
                id="comment-raw-input"
                value={commentsText}
                onChange={(e) => setCommentsText(e.target.value)}
                rows={10}
                placeholder="Ex.&#10;user_peter: Check DM for details&#10;sarah: Incredible photo!&#10;rich_crypto: Invest now and get 200% return"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 text-xs focus:outline-none focus:border-pink-500 transition-colors font-mono leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              id="btn-scan-comments"
              className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white font-bold py-2.5 px-4 rounded-xl text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-55 flex items-center justify-center space-x-2"
            >
              <span>{loading ? "Sorting out Bot Clusters..." : "Analyze Comments Feed"}</span>
            </button>
          </form>
        </div>

        {/* Results Area Right */}
        <div className="lg:col-span-2">
          {loading && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 py-16 flex flex-col items-center justify-center text-center space-y-6" id="comments-loading">
              <div className="h-12 w-12 rounded-full border-4 border-slate-800 border-t-pink-500 animate-spin flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-pink-500 animate-pulse" />
              </div>
              <div className="space-y-2 max-w-sm">
                <h4 className="text-slate-200 font-bold text-sm">Classification Engine Running</h4>
                <p className="text-slate-400 text-xs leading-normal">
                  Evaluating individual comment threads for recursive emoji structures, financial endorsements, and brand outreach spam markers via Gemini.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-red-400 flex items-start space-x-3" id="comments-error">
              <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-100">Scan Operation Interrupted</h4>
                <p className="text-xs text-red-300">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && !result && (
            <div className="bg-slate-900 border border-slate-850 border-dashed rounded-xl p-16 flex flex-col items-center justify-center text-center space-y-4 text-slate-500" id="comments-idle">
              <Sparkles className="h-10 w-10 text-slate-700" />
              <div className="max-w-sm space-y-1">
                <h4 className="text-slate-300 font-bold text-sm">Comments Scan Ledger Empty</h4>
                <p className="text-xs text-slate-400">
                  Input comment feeds in the panel to scan threat levels and verify engagement authenticity.
                </p>
              </div>
            </div>
          )}

          {!loading && !error && result && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6" id="comments-results-card">
              {/* Overall metric box */}
              <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Integrity Assessment</span>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                    "{result.summary}"
                  </p>
                </div>

                <div className="flex-shrink-0 text-center sm:text-right">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Overall Spam Index</span>
                  <div className="flex items-baseline space-x-1.5 justify-center sm:justify-end mt-1">
                    <span className={`text-3xl font-black ${
                      result.overallSpamPercent > 50 ? "text-red-400" : result.overallSpamPercent > 20 ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      {result.overallSpamPercent}%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold">Of Comments Flagged</span>
                </div>
              </div>

              {/* Details of table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Audited Listing ({result.auditedComments.length})</h4>
                
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {result.auditedComments.map((comment, index) => {
                    const theme = getCategoryTheme(comment.category);
                    return (
                      <div
                        key={index}
                        className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-slate-800 transition-colors"
                      >
                        <div className="space-y-1.5 text-xs max-w-[70%]">
                          <p className="text-slate-100 font-medium font-mono">
                            {comment.text}
                          </p>
                          <div className="flex items-center space-x-1 py-0.5 text-slate-400 font-medium leading-normal">
                            <Info className="h-3.5 w-3.5 inline text-slate-500 flex-shrink-0" />
                            <span className="text-[11px]">{comment.explanation}</span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:items-end space-y-1.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${theme.bg} flex items-center space-x-1.5`}>
                            <span className={`h-1 w-1 rounded-full ${theme.dot}`}></span>
                            <span>{theme.lbl}</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Confidence: {comment.confidence}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
