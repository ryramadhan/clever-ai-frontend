import { useNavigate } from "react-router-dom";

export default function ChangelogPage() {
  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
  }

  const releases = [
    {
      version: "v1.2.0",
      date: "April 2026",
      status: "Terbaru",
      changes: [
        { type: "feature", text: "Footer dengan navigasi lengkap (Chat, History, API, Dokumentasi)" },
        { type: "feature", text: "Halaman dokumentasi API (/docs)" },
        { type: "feature", text: "Halaman panduan pengguna (/guide)" },
        { type: "feature", text: "Tautan GitHub di footer dengan ikon eksternal" },
        { type: "improvement", text: "Antarmuka Bento Grid di beranda dengan 4 kartu fitur" },
        { type: "improvement", text: "Tombol kembali ke atas di footer" },
        { type: "fix", text: "Perbaikan smooth scroll dan auto-focus saat mengklik Chat" },
      ],
    },
    {
      version: "v1.1.0",
      date: "Maret 2026",
      changes: [
        { type: "feature", text: "Streaming AI real-time dengan Server-Sent Events (SSE)" },
        { type: "feature", text: "Autentikasi Google OAuth dengan one-tap" },
        { type: "feature", text: "Auto-retry dengan exponential backoff (3x)" },
        { type: "feature", text: "Penanganan rate limiting dengan pesan kesalahan yang jelas" },
        { type: "improvement", text: "Tema gelap monochrome yang konsisten di seluruh aplikasi" },
        { type: "improvement", text: "Desain responsif untuk perangkat mobile dan desktop" },
        { type: "fix", text: "Perbaikan kebocoran memori pada listener streaming" },
      ],
    },
    {
      version: "v1.0.0",
      date: "Februari 2026",
      changes: [
        { type: "feature", text: "Peluncuran Clever AI - Antarmuka Chat AI" },
        { type: "feature", text: "Antarmuka bergaya ChatGPT/Gemini dengan estetika monochrome" },
        { type: "feature", text: "Sistem autentikasi (JWT + email/kata sandi)" },
        { type: "feature", text: "Mode tamu tanpa autentikasi" },
        { type: "feature", text: "Manajemen riwayat dengan semat, ubah nama, hapus" },
        { type: "feature", text: "Antarmuka dwibahasa (Bahasa Inggris & Indonesia)" },
        { type: "feature", text: "Salin ke clipboard untuk respons AI" },
        { type: "improvement", text: "Database PostgreSQL dengan pemisahan data" },
        { type: "improvement", text: "Auto-scroll cerdas saat streaming" },
      ],
    },
  ];

  const typeLabels = {
    feature: { text: "Baru", color: "bg-emerald-500/20 text-emerald-400" },
    improvement: { text: "Diperbaiki", color: "bg-amber-500/20 text-amber-400" },
    fix: { text: "Diperbaiki", color: "bg-blue-500/20 text-blue-400" },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white/90 transition-colors"
              aria-label="Go back"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-sm font-medium text-white">Changelog</h1>
          </div>
          <span className="text-xs text-white/60">Release History</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Intro */}
        <section className="mb-10">
          <h2 className="text-2xl font-normal text-white mb-3">
            Catatan Perubahan
          </h2>
          <p className="text-sm text-white/60 leading-relaxed">
            Riwayat pembaruan Clever AI. Tinjau fitur terbaru, peningkatan, dan perbaikan bug.
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
                <h3 className="text-lg font-medium text-white/90">
                  {release.version}
                </h3>
                {release.status && (
                  <span className="px-2 py-0.5 rounded-full bg-white/[0.08] border border-white/[0.12] text-[10px] text-white/60">
                    {release.status}
                  </span>
                )}
                <span className="text-xs text-white/60">{release.date}</span>
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
                    <span className="text-sm text-white/70">{change.text}</span>
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
              <p className="text-sm font-medium text-white/80 mb-1">
                Tinjau seluruh rilis di GitHub
              </p>
              <p className="text-xs text-white/60">
                Riwayat rilis lengkap dengan detail teknis
              </p>
            </div>
            <svg
              className="w-5 h-5 text-white/60 group-hover:text-white/90 transition-colors"
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
          <p className="text-[10px] text-white/45">
            Clever AI • Versi Semantik • 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
