import { useState } from "react";
import { BookOpen, Check, HelpCircle, Shield, AlertTriangle, MessageSquare, TrendingDown, Eye } from "lucide-react";
import { motion } from "motion/react";

export default function DetectorGuide() {
  const [checklist, setChecklist] = useState({
    username: false,
    followingRatio: false,
    postFrequency: false,
    genericComments: false,
    bioLinkShortener: false,
    emptyProfilePic: false,
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const calculatedScore = Object.values(checklist).filter(Boolean).length * 16.6;

  const botTypes = [
    {
      title: "1. The Crypto/Forex Recruiting Bot",
      description: "Automated networks aiming to drag targets into financial scams. Usually operated by duplicate accounts replicating real finance influencers.",
      signals: ["Promotes names of 'brokers' or 'recovery agents' specifically in comment sections", "DMs promise low-risk, high-return payout channels", "Link in bio is an unvalidated Telegram channel or WhatsApp redirect"],
      icon: "💸",
      color: "border-red-500/20 bg-red-500/5 text-red-400"
    },
    {
      title: "2. The Luxury/Fashion Affiliate Bot",
      description: "Mass-registered accounts masquerading as luxury brands or talent scouts, seeking to sell cheap drop-shipped goods disguised as collaborations.",
      signals: ["Auto-comments 'Hey gorgeous! Collab? DM @brand_name'", "The bio lists hundreds of 'ambassadors' or directs you to fill a form", "Low/no actual posts containing human faces or model content"],
      icon: "💎",
      color: "border-amber-500/20 bg-amber-500/5 text-amber-400"
    },
    {
      title: "3. The Purchased Follower Network",
      description: "Inactive, mass-generated user databases sold in hundreds or thousands to inflate profile prestige. Severely damages organic brand engagement levels.",
      signals: ["Profile shows 25,000+ followers but averages only 10 likes per upload", "Follower lists containing private, empty accounts with no bios", "Likes section lists thousands of generic accounts with non-English lettering"],
      icon: "👤",
      color: "border-blue-500/20 bg-blue-500/5 text-blue-400"
    },
    {
      title: "4. The Engagement Pod Bots",
      description: "Private automated groups where accounts instantly swap likes/comments inside an algorithm to trick Instagram into boosting the post's discoverability.",
      signals: ["Dozens of high-intensity comments uploaded within seconds of a post going live", "Comments are purely repetitive emojis ('🙌🙌', '⚡⚡', '😍😍')", "Commenters are same recursive list of other low-quality accounts"],
      icon: "🤖",
      color: "border-purple-500/20 bg-purple-500/5 text-purple-400"
    }
  ];

  return (
    <div className="space-y-8" id="detector-guide-page">
      {/* Intro Hero */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <BookOpen className="h-48 w-48 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full text-xs text-pink-400 font-semibold uppercase tracking-wider">
            Educational Field Manual
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3 tracking-tight">
            How Bot Detection Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 leading-relaxed">
            Bot detector algorithms evaluate hundreds of micro-signatures to calculate anomalous behavior. 
            Understanding these patterns is your first line of defense against cyber-phishing, fake engagement, 
            and malicious direct messages on Instagram.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Types of bots */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-200 flex items-center space-x-2">
            <Shield className="h-5 w-5 text-pink-500" />
            <span>Common Bot Typologies on IG</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {botTypes.map((bot, index) => (
              <div key={index} className={`border rounded-xl p-5 space-y-3 transition-colors ${bot.color}`}>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{bot.icon}</span>
                  <h4 className="font-bold text-slate-100 text-sm tracking-tight">{bot.title}</h4>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{bot.description}</p>
                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Key Markers:</span>
                  <ul className="space-y-1">
                    {bot.signals.map((sig, sIdx) => (
                      <li key={sIdx} className="text-[11px] text-slate-300 flex items-start space-x-1.5">
                        <span className="text-pink-500 mt-0.5">•</span>
                        <span>{sig}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Interactive Sandbox Manual Inspector */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-200 flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-yellow-500" />
            <span>Manual Audit Playground</span>
          </h3>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="text-xs text-slate-400">
              Check the markers you manually suspect in an Instagram profile to view a simulated risk calculation:
            </div>

            <div className="space-y-2">
              {[
                { key: "username" as const, label: "Random/numeric ending in handle (e.g. @kate_48291)" },
                { key: "followingRatio" as const, label: "Massive imbalances (following 7,000 but <200 followers)" },
                { key: "postFrequency" as const, label: "Dozens of posts on same day, then zero updates for months" },
                { key: "genericComments" as const, label: "Comments are copy-paste, generic praises, or DM pitches" },
                { key: "bioLinkShortener" as const, label: "Bio contains questionable link redirects or URL shortener" },
                { key: "emptyProfilePic" as const, label: "Missing profile picture, default avatar, or stolen model picture" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => toggleCheck(item.key)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                    checklist[item.key]
                      ? "bg-pink-500/10 border-pink-500/40 text-pink-400"
                      : "bg-slate-800/40 border-slate-800/80 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span className="max-w-[85%]">{item.label}</span>
                  <div className={`h-4.5 w-4.5 rounded flex items-center justify-center border text-[10px] ${
                    checklist[item.key] ? "bg-pink-500 border-pink-500 text-white" : "border-slate-600"
                  }`}>
                    {checklist[item.key] && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </button>
              ))}
            </div>

            {/* Sim score widget */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Simulated Bot Risk</span>
                <span className={`text-xs font-black ${
                  calculatedScore > 60 ? "text-red-400" : calculatedScore > 30 ? "text-amber-400" : "text-emerald-400"
                }`}>
                  {calculatedScore.toFixed(0)}% Match
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    calculatedScore > 60 ? "bg-red-500" : calculatedScore > 30 ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${calculatedScore}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                {calculatedScore > 60
                  ? "🚨 Severe overlap with mechanical bot activity signatures. Recommend immediate reporting/blocking."
                  : calculatedScore > 30
                  ? "⚠️ Moderately suspicious. May be a real user utilizing automation aids, or a clever spam profile."
                  : "✅ Clean or very minimal robotic indicators detected. Standard organic parameters."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
