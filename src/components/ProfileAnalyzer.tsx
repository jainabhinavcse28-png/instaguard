import React, { useState } from "react";
import { ShieldAlert, Users, Image as ImageIcon, Link as LinkIcon, MessageSquare, AlertCircle, Sparkles, Wand2 } from "lucide-react";
import { ProfileAnalysisInput, ProfileAnalysisResult, MOCK_PROFILE_PRESETS } from "../types";
import AuditReport from "./AuditReport";

export default function ProfileAnalyzer() {
  const [formData, setFormData] = useState<ProfileAnalysisInput>({
    username: "",
    bio: "",
    followers: 1200,
    following: 600,
    posts: 42,
    avgLikes: 150,
    avgComments: 12,
    consecutiveNumbers: false,
    noAvatar: false,
    linkInBio: "",
    sampleComments: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProfileAnalysisResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Math.max(0, parseInt(value) || 0) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const applyPreset = (preset: typeof MOCK_PROFILE_PRESETS[0]) => {
    setFormData({ ...preset.data });
    setError(null);
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      setError("Please specify an Instagram username.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze profile.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8" id="profile-analyzer-container">
      {/* Overview Block */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <ShieldAlert className="h-48 w-48 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full text-xs text-pink-400 font-semibold uppercase tracking-wider">
            Automated Audit Tool
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3 tracking-tight">
            Advanced Profile Bot Auditor
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 leading-relaxed">
            Validate an Instagram profile against custom cyber threat vectors. Input known indicators or select 
            one of the benchmark threat presets to observe live Gemini security heuristic analysis.
          </p>
        </div>
      </div>

      {/* Preset Quick Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
          <Wand2 className="h-4 w-4 text-pink-400" />
          <span>Interactive Preset Profiles Sandbox</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="preset-selector-grid">
          {MOCK_PROFILE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              id={`preset-btn-${idx}`}
              onClick={() => applyPreset(preset)}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 text-left transition-all duration-150 flex flex-col justify-between space-y-2 h-full group"
            >
              <div>
                <div className="font-bold text-slate-200 text-xs sm:text-sm group-hover:text-pink-400 transition-colors">
                  {preset.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 leading-normal line-clamp-2">
                  {preset.description}
                </div>
              </div>
              <div className="text-[10px] bg-slate-950 font-mono text-slate-400 px-2 py-0.5 rounded border border-slate-800 w-fit">
                {preset.likelyOutcome}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Analyzer Form / Result Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Form (2 Columns on large screens if no result, but taking 1 column of grid otherwise) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-1 space-y-5">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Profile Metrics Input</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4" id="profile-audit-form">
            {/* Username */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Username handle *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold text-sm">@</span>
                <input
                  type="text"
                  name="username"
                  id="field-username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="e.g. travel_gazer_123"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-8 pr-4 text-slate-100 text-sm focus:outline-none focus:border-pink-500 transition-colors font-semibold"
                  required
                />
              </div>
            </div>

            {/* Account Bio */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Bio Description</label>
              <textarea
                name="bio"
                id="field-bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                placeholder="Description, hashtags, business email, or link redirections"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 text-xs focus:outline-none focus:border-pink-500 transition-colors leading-relaxed"
              />
            </div>

            {/* Counts Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Followers</label>
                <input
                  type="number"
                  name="followers"
                  id="field-followers"
                  value={formData.followers}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 text-xs text-center focus:outline-none focus:border-pink-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Following</label>
                <input
                  type="number"
                  name="following"
                  id="field-following"
                  value={formData.following}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 text-xs text-center focus:outline-none focus:border-pink-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Posts count</label>
                <input
                  type="number"
                  name="posts"
                  id="field-posts"
                  value={formData.posts}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 text-xs text-center focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">Avg Likes/Post</label>
                <input
                  type="number"
                  name="avgLikes"
                  id="field-avglikes"
                  value={formData.avgLikes}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 text-xs text-center focus:outline-none focus:border-pink-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">Avg Comments/Post</label>
                <input
                  type="number"
                  name="avgComments"
                  id="field-avgcomments"
                  value={formData.avgComments}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 text-xs text-center focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            {/* Flags Checkboxes */}
            <div className="py-2 space-y-2 border-t border-b border-slate-800/60">
              <label className="flex items-center space-x-2.5 cursor-pointer py-1 text-xs text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  name="consecutiveNumbers"
                  id="field-consecutiveNumbers"
                  checked={formData.consecutiveNumbers}
                  onChange={handleInputChange}
                  className="rounded border-slate-800 text-pink-600 focus:ring-pink-500/20"
                />
                <span className="select-none">Numeric trailing suffix (e.g. @bob8427)</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer py-1 text-xs text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  name="noAvatar"
                  id="field-noAvatar"
                  checked={formData.noAvatar}
                  onChange={handleInputChange}
                  className="rounded border-slate-800 text-pink-600 focus:ring-pink-500/20"
                />
                <span className="select-none">Blank default profile avatar</span>
              </label>
            </div>

            {/* Link in bio URL */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center space-x-1">
                <LinkIcon className="h-3 w-3" />
                <span>Link in bio URL</span>
              </label>
              <input
                type="text"
                name="linkInBio"
                id="field-linkInBio"
                value={formData.linkInBio}
                onChange={handleInputChange}
                placeholder="e.g. linktr.ee/scam"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Sample Comments received */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase block flex items-center space-x-1">
                <MessageSquare className="h-3 w-3" />
                <span>Sample Comments from Others</span>
              </label>
              <textarea
                name="sampleComments"
                id="field-samplecomments"
                value={formData.sampleComments}
                onChange={handleInputChange}
                rows={2}
                placeholder="Ex. 'Hey cute, check DM!', 'Great post!', 'Promo in @vip'"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 text-xs focus:outline-none focus:border-pink-500"
              />
            </div>

            <button
              type="submit"
              id="btn-trigger-audit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white py-2.5 px-4 rounded-xl text-sm font-bold shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2"
            >
              <span>{loading ? "Crunching Account Data..." : "Run AI Account Audit"}</span>
            </button>
          </form>
        </div>

        {/* Right Output Area (occupying 2 columns of grid) */}
        <div className="lg:col-span-2">
          {loading && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-6" id="audit-loading-panel">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-slate-800 border-t-pink-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldAlert className="h-6 w-6 text-pink-500 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-slate-200 font-bold text-base">Heuristic Engine Active</h4>
                <p className="text-slate-400 text-xs max-w-sm leading-normal">
                  Evaluating engagement thresholds, scanning profile bio keywords, and querying Gemini model 3.5-flash for bot identification patterns. Please hold.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-red-400 flex items-start space-x-3" id="audit-error-panel">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-100">Audit execution error</h4>
                <p className="text-xs leading-normal text-red-300">{error}</p>
                <p className="text-[11px] text-slate-400 pt-1">
                  Ensure GEMINI_API_KEY environment variable is configured in the sandbox secrets panel.
                </p>
              </div>
            </div>
          )}

          {!loading && !error && !result && (
            <div className="bg-slate-900 border border-slate-800 border-dashed rounded-xl p-16 flex flex-col items-center justify-center text-center space-y-4 text-slate-500" id="audit-idle-panel">
              <div className="bg-slate-950 p-4 rounded-full border border-slate-800">
                <Sparkles className="h-8 w-8 text-slate-600" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="text-slate-300 font-bold text-sm">Awaiting Heuristic Instructions</h4>
                <p className="text-xs text-slate-400 leading-normal">
                  Finetune the specific metrics on the left, or pick one of the simulator presets to calculate an Instant Social Bot Score.
                </p>
              </div>
            </div>
          )}

          {!loading && !error && result && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative" id="audit-results-panel">
              <div className="absolute top-4 right-4 bg-pink-500/10 border border-pink-500/30 px-2.5 py-0.5 rounded-full text-[10px] text-pink-400 font-bold flex items-center space-x-1">
                <span className="h-1 w-1 bg-pink-400 rounded-full animate-ping"></span>
                <span>Audit Verified</span>
              </div>
              <AuditReport result={result} username={formData.username} onReset={() => setResult(null)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
