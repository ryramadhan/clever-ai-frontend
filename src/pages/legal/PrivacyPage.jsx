import { useNavigate } from "react-router-dom";

export default function PrivacyPage() {
  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
  }

  const sections = [
    {
      title: "Informasi yang Kami Kumpulkan",
      content: [
        {
          subtitle: "Data Akun",
          text: "Kami mengumpulkan nama, email, dan password (terenkripsi) saat kamu mendaftar. Data Google OAuth (nama, email, foto profil) juga dikumpulkan jika kamu menggunakan login Google.",
        },
        {
          subtitle: "Chat History",
          text: "Semua percakapan dengan AI disimpan untuk memungkinkan fitur history. Data chat milik user yang login disimpan terpisah dari data guest.",
        },
        {
          subtitle: "Data Teknis",
          text: "IP address, browser type, dan timestamp disimpan untuk rate limiting dan keamanan sistem.",
        },
      ],
    },
    {
      title: "Cara Kami Menggunakan Data",
      content: [
        {
          subtitle: "Layanan Utama",
          text: "Data digunakan untuk autentikasi, menyimpan chat history, dan menyediakan layanan AI chat.",
        },
        {
          subtitle: "Keamanan",
          text: "Rate limiting dan deteksi aktivitas mencurigakan untuk melindungi layanan dari abuse.",
        },
        {
          subtitle: "Improvement",
          text: "Analisis anonim untuk meningkatkan kualitas respons AI dan user experience.",
        },
      ],
    },
    {
      title: "Penyimpanan & Keamanan",
      content: [
        {
          subtitle: "Database",
          text: "Data disimpan di PostgreSQL (Neon) dengan enkripsi SSL. Password di-hash menggunakan bcrypt.",
        },
        {
          subtitle: "Data Retention",
          text: "Chat history disimpan selama akun aktif. Data akun bisa dihapus permanen dengan request ke support.",
        },
        {
          subtitle: "Data Separation",
          text: "Strict separation antara data user. Kamu hanya bisa melihat data milikmu sendiri.",
        },
      ],
    },
    {
      title: "Hak Kamu",
      content: [
        {
          subtitle: "Akses & Export",
          text: "Kamu bisa mengakses dan mengekspor chat history kapan saja melalui sidebar.",
        },
        {
          subtitle: "Penghapusan Data",
          text: "Kamu bisa menghapus chat history individual atau seluruh akun. Request penghapusan akun permanen bisa diajukan via email.",
        },
        {
          subtitle: "Opt-out",
          text: "Gunakan mode Guest jika tidak ingin data disimpan secara permanen.",
        },
      ],
    },
  ];

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
            <h1 className="text-sm font-medium text-white/80">Privacy Policy</h1>
          </div>
          <span className="text-xs text-white/40">Legal</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Intro */}
        <section className="mb-10">
          <h2 className="text-2xl font-normal text-white/90 mb-3">
            Kebijakan Privasi
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Terakhir diupdate: April 2024. Kami menghargai privasi kamu dan berkomitmen untuk melindungi data pribadi.
          </p>
        </section>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h3 className="text-sm font-medium text-white/70 mb-4">
                {section.title}
              </h3>
              <div className="space-y-4">
                {section.content.map((item) => (
                  <div
                    key={item.subtitle}
                    className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]"
                  >
                    <h4 className="text-xs font-medium text-white/60 mb-2">
                      {item.subtitle}
                    </h4>
                    <p className="text-xs text-white/40 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Contact */}
        <section className="mt-10 pt-8 border-t border-white/[0.06]">
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <h3 className="text-sm font-medium text-white/70 mb-2">
              Kontak Privasi
            </h3>
            <p className="text-xs text-white/40 leading-relaxed mb-3">
              Untuk pertanyaan tentang privasi, request penghapusan data, atau laporan kebocoran data:
            </p>
            <a
              href="mailto:privacy@cleverai.app"
              className="text-xs text-white/50 hover:text-white/70 transition-colors"
            >
              privacy@cleverai.app
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-[10px] text-white/20">
            MoodWrite AI Privacy Policy • 2024
          </p>
        </footer>
      </main>
    </div>
  );
}
