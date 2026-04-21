import { useNavigate } from "react-router-dom";

export default function SecurityPage() {
  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
  }

  const features = [
    {
      icon: "🔐",
      title: "Password Hashing",
      desc: "Password di-hash dengan bcrypt sebelum disimpan. Kami tidak pernah menyimpan password dalam bentuk plain text.",
    },
    {
      icon: "🌐",
      title: "HTTPS/SSL",
      desc: "Semua komunikasi dienkripsi dengan HTTPS. Database connection juga menggunakan SSL encryption.",
    },
    {
      icon: "🎫",
      title: "JWT Authentication",
      desc: "JSON Web Tokens dengan expiry untuk autentikasi stateless. Token bisa di-revoke kapan saja.",
    },
    {
      icon: "🛡️",
      title: "Rate Limiting",
      desc: "Perlindungan terhadap brute force dan DDoS dengan rate limiting pada semua endpoint.",
    },
    {
      icon: "🔒",
      title: "Data Separation",
      desc: "Strict data isolation. Setiap user hanya bisa mengakses data miliknya sendiri di database level.",
    },
    {
      icon: "🔍",
      title: "Input Sanitization",
      desc: "Semua input di-validasi dan di-sanitize untuk mencegah SQL injection dan XSS attacks.",
    },
  ];

  const bestPractices = [
    {
      title: "Gunakan Password Kuat",
      content: "Minimal 8 karakter dengan kombinasi huruf, angka, dan simbol. Hindari informasi personal.",
    },
    {
      title: "Jangan Bagikan Akun",
      content: "Akun bersifat personal. Jangan berbagi password atau biarkan orang lain menggunakan akunmu.",
    },
    {
      title: "Logout di Device Publik",
      content: "Selalu logout setelah menggunakan MoodWrite AI di device publik atau shared.",
    },
    {
      title: "Waspada Phishing",
      content: "Kami tidak akan pernah meminta password via email. Pastikan URL adalah clever-ai-chat.vercel.app",
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
            <h1 className="text-sm font-medium text-white/80">Security</h1>
          </div>
          <span className="text-xs text-white/40">Trust & Safety</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Intro */}
        <section className="mb-10">
          <h2 className="text-2xl font-normal text-white/90 mb-3">
            Keamanan
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Keamanan data kamu adalah prioritas utama. Berikut langkah-langkah yang kami ambil untuk melindungi informasimu.
          </p>
        </section>

        {/* Security Features */}
        <section className="mb-10">
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
            Fitur Keamanan
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors"
              >
                <div className="text-lg mb-2">{feature.icon}</div>
                <h4 className="text-sm font-medium text-white/70 mb-1">
                  {feature.title}
                </h4>
                <p className="text-xs text-white/40 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-10">
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
            Best Practices untuk User
          </h3>
          <div className="space-y-3">
            {bestPractices.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]"
              >
                <span className="text-xs text-emerald-400 mt-0.5">✓</span>
                <div>
                  <h4 className="text-sm font-medium text-white/70 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-white/40 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Report Vulnerability */}
        <section className="mb-10 pt-8 border-t border-white/[0.06]">
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
            Report Security Issue
          </h3>
          <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/[0.05] to-transparent border border-emerald-500/20">
            <p className="text-xs text-white/50 leading-relaxed mb-3">
              Jika kamu menemukan kerentanan keamanan, laporkan segera. Kami menghargai responsible disclosure.
            </p>
            <a
              href="mailto:security@cleverai.app"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 hover:bg-emerald-500/15 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              security@cleverai.app
            </a>
          </div>
        </section>

        {/* Security Updates */}
        <section>
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
            Update Keamanan
          </h3>
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <p className="text-xs text-white/40 leading-relaxed mb-3">
              Kami terus memperbarui sistem keamanan. Pantau changelog untuk update terbaru.
            </p>
            <a
              href="/changelog"
              className="text-xs text-white/50 hover:text-white/70 transition-colors"
            >
              Lihat Changelog →
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-[10px] text-white/20">
            MoodWrite AI Security • Last updated April 2024
          </p>
        </footer>
      </main>
    </div>
  );
}
