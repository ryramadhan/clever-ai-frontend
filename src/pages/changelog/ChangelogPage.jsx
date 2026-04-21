import { useNavigate } from "react-router-dom";

export default function ChangelogPage() {
  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
  }

  const releases = [
    {
      version: "v1.2.0",
      date: "April 2024",
      status: "Latest",
      changes: [
        { type: "feature", text: "Footer dengan navigasi lengkap (Chat, History, API, Docs)" },
        { type: "feature", text: "Halaman dokumentasi API (/docs)" },
        { type: "feature", text: "Halaman user guide (/guide)" },
        { type: "feature", text: "Link GitHub di footer dengan icon external" },
        { type: "improvement", text: "Bento Grid UI di homepage dengan 4 feature cards" },
        { type: "improvement", text: "Back to top button di footer" },
        { type: "fix", text: "Smooth scroll dan auto-focus saat klik Chat" },
      ],
    },
    {
      version: "v1.1.0",
      date: "March 2024",
      changes: [
        { type: "feature", text: "Real-time AI streaming dengan Server-Sent Events (SSE)" },
        { type: "feature", text: "Google OAuth login dengan one-tap" },
        { type: "feature", text: "Auto-retry dengan exponential backoff (3x)" },
        { type: "feature", text: "Rate limiting handling dengan pesan error yang jelas" },
        { type: "improvement", text: "Monochrome dark theme consistent di seluruh app" },
        { type: "improvement", text: "Responsive design untuk mobile dan desktop" },
        { type: "fix", text: "Memory leak di streaming listener" },
      ],
    },
    {
      version: "v1.0.0",
      date: "February 2024",
      changes: [
        { type: "feature", text: "Launch MoodWrite AI - AI Chat Interface" },
        { type: "feature", text: "ChatGPT/Gemini-style UI dengan monochrome aesthetic" },
        { type: "feature", text: "Authentication system (JWT + email/password)" },
        { type: "feature", text: "Guest mode tanpa login" },
        { type: "feature", text: "History management dengan pin, rename, delete" },
        { type: "feature", text: "Bilingual UI (English & Indonesia)" },
        { type: "feature", text: "Copy to clipboard untuk AI responses" },
        { type: "improvement", text: "PostgreSQL database dengan data separation" },
        { type: "improvement", text: "Smart auto-scroll saat streaming" },
      ],
    },
  ];

  const typeLabels = {
    feature: { text: "New", color: "bg-emerald-500/20 text-emerald-400" },
    improvement: { text: "Improved", color: "bg-amber-500/20 text-amber-400" },
    fix: { text: "Fixed", color: "bg-blue-500/20 text-blue-400" },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white/80 transition-colors"
              aria-label="Go back"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-sm font-medium text-white/80">Changelog</h1>
          </div>
          <span className="text-xs text-white/40">Release History</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Intro */}
        <section className="mb-10">
          <h2 className="text-2xl font-normal text-white/90 mb-3">
            Perubahan & Update
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Riwayat update MoodWrite AI. Lihat fitur baru, improvements, dan bug fixes.
          </p>
        </section>

        {/* Legend */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            {Object.entries(typeLabels).map(([key, { text, color }]) => (
              <span
                key={key}
                className={`px-2 py-1 rounded text-[10px] font-medium ${color}`}
              >
                {text}
              </span>
            ))}
          </div>
        </section>

        {/* Releases */}
        <div className="space-y-8">
          {releases.map((release, index) => (
            <section
              key={release.version}
              className={`relative ${index !== releases.length - 1 ? "pb-8 border-b border-white/[0.06]" : ""}`}
            >
              {/* Version Header */}
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-medium text-white/80">
                  {release.version}
                </h3>
                {release.status && (
                  <span className="px-2 py-0.5 rounded-full bg-white/[0.08] border border-white/[0.12] text-[10px] text-white/60">
                    {release.status}
                  </span>
                )}
                <span className="text-xs text-white/40">{release.date}</span>
              </div>

              {/* Changes */}
              <ul className="space-y-2">
                {release.changes.map((change, changeIndex) => (
                  <li
                    key={changeIndex}
                    className="flex items-start gap-3"
                  >
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium mt-0.5 ${typeLabels[change.type].color}`}
                    >
                      {typeLabels[change.type].text}
                    </span>
                    <span className="text-sm text-white/60">{change.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* GitHub Link */}
        <section className="mt-10 pt-8 border-t border-white/[0.06]">
          <a
            href="https://github.com/ryramadhan/moodwrite-ai-frontend/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all group"
          >
            <div>
              <p className="text-sm font-medium text-white/70 mb-1">
                Lihat semua release di GitHub
              </p>
              <p className="text-xs text-white/40">
                Full release history dengan detail teknis
              </p>
            </div>
            <svg
              className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </section>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-[10px] text-white/20">
            MoodWrite AI • Semantic Versioning
          </p>
        </footer>
      </main>
    </div>
  );
}
