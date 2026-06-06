/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Header from "./components/Header";
import ProfileAnalyzer from "./components/ProfileAnalyzer";
import CommentsScanner from "./components/CommentsScanner";
import VisionScanner from "./components/VisionScanner";
import DetectorGuide from "./components/DetectorGuide";
import { Shield, Sparkles, Check, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("profile");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" id="instagard-app-root">
      {/* Top Banner Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Core View Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main content viewport columns */}
          <div className="lg:col-span-3 space-y-8" id="viewport-container">
            {activeTab === "profile" && <ProfileAnalyzer />}
            {activeTab === "comments" && <CommentsScanner />}
            {activeTab === "screenshot" && <VisionScanner />}
            {activeTab === "guide" && <DetectorGuide />}
          </div>

          {/* Persistent Sidebar Utility column (Right sidebar) */}
          <div className="space-y-6" id="sidebar-container">
            {/* Core Security Advisory Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-pink-500 flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Security Advisories</span>
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-1">
                  <span className="text-[10px] bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded text-red-400 font-extrabold uppercase">
                    Urgent Alert
                  </span>
                  <p className="text-xs text-slate-300 mt-1.5 leading-normal">
                    Do not submit personal passwords, authorization tokens, or cookies inside audit inputs under any circumstances.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-1">
                  <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-400 font-extrabold uppercase">
                    Analysis Type
                  </span>
                  <p className="text-xs text-slate-400 mt-1.5 leading-normal">
                    This platform uses advanced AI heuristics to spot anomalies. This does not represent an official Instagram action.
                  </p>
                </div>
              </div>

              <div className="p-1 text-center">
                <a 
                  href="#guide" 
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("guide");
                  }}
                  className="text-xs text-pink-400 font-bold hover:underline inline-flex items-center space-x-1"
                >
                  <span>Learn how detection works</span>
                  <ChevronRight className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Platform Settings Hint */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest flex items-center space-x-1.5">
                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                <span>Sandbox Insights</span>
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Need more request bandwidth or advanced model outputs? You can link your private keys natively anytime inside the <b>Secrets panel</b>.
              </p>
              <div className="bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-[10px] font-mono text-slate-500 select-all whitespace-normal break-all">
                KEY_ID: GEMINI_API_KEY
              </div>
            </div>

            {/* Defense Counter list */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase block tracking-wider">IG Bot Mitigation Checklist</h3>
              
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start space-x-2">
                  <span className="text-pink-500 font-extrabold mt-0.5">✓</span>
                  <span>Set profile privacy state to "Private" to screen followers.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-pink-500 font-extrabold mt-0.5">✓</span>
                  <span>Enable IG's Hidden Words filter for comments.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-pink-500 font-extrabold mt-0.5">✓</span>
                  <span>Restrict accounts sending repetitive bulk DMs.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </main>

      {/* Aesthetic Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 text-xs py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-left font-medium">
            <span>&copy; {new Date().getFullYear()} InstaGuard Security Platform.</span>
            <span className="block text-[10px] text-slate-600 mt-0.5">Designed with absolute high-contrast negative space.</span>
          </div>
          <div className="flex space-x-4 font-bold uppercase tracking-wider text-[10px]">
            <a href="https://ai.studio" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">Google AI Studio</a>
            <span className="text-slate-700">|</span>
            <span className="text-slate-500">Multimodal Heuristic v1.2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
