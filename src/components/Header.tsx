import { ShieldAlert, Info, Github } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const tabs = [
    { id: "profile", label: "Profile Auditor", icon: "👤" },
    { id: "comments", label: "Comment Scanner", icon: "💬" },
    { id: "screenshot", label: "Vision Scanner", icon: "📸" },
    { id: "guide", label: "Bot Pattern Guide", icon: "📖" },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 p-2 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/10">
              <ShieldAlert className="h-6 w-6 text-white" id="header-logo-icon" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                InstaGuard
              </h1>
              <p className="text-xs text-slate-400 font-medium">Insta Bot Security Audit Hub</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1" id="desktop-nav-menu">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-2 ${
                    isActive
                      ? "bg-slate-800 text-pink-400 shadow-inner border border-slate-700/60"
                      : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Accents */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-xs text-emerald-400 font-semibold" id="sandbox-status">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Gemini Heuristic Engine Live</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex overflow-x-auto py-2.5 -mx-4 px-4 scrollbar-none border-t border-slate-800 space-x-1" id="mobile-nav-buttons">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-mobile-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center space-x-1.5 flex-shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-500/40 text-pink-400"
                    : "bg-slate-800/40 border border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
