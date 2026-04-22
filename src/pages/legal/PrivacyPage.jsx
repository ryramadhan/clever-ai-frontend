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
          text: "Kami mengumpulkan nama, alamat email, dan kata sandi (terenkripsi) saat Anda mendaftar. Data Google OAuth (nama, email, foto profil) juga dikumpulkan apabila Anda menggunakan login Google.",
        },
        {
          subtitle: "Riwayat Percakapan",
          text: "Semua percakapan dengan AI disimpan untuk mengaktifkan fitur riwayat. Data percakapan pengguna terdaftar disimpan terpisah dari data pengguna tamu.",
        },
        {
          subtitle: "Data Teknis",
          text: "Alamat IP, jenis browser, dan timestamp disimpan untuk pembatasan laju permintaan dan keamanan sistem.",
        },
      ],
    },
    {
      title: "Cara Kami Menggunakan Data",
      content: [
        {
          subtitle: "Layanan Utama",
          text: "Data digunakan untuk autentikasi, penyimpanan riwayat percakapan, dan penyediaan layanan AI chat.",
        },
        {
          subtitle: "Keamanan",
          text: "Pembatasan laju permintaan dan deteksi aktivitas mencurigakan untuk melindungi layanan dari penyalahgunaan.",
        },
        {
          subtitle: "Peningkatan Layanan",
          text: "Analisis anonim untuk meningkatkan kualitas respons AI dan pengalaman pengguna.",
        },
      ],
    },
    {
      title: "Penyimpanan & Keamanan",
      content: [
        {
          subtitle: "Database",
          text: "Data disimpan di PostgreSQL (Neon) dengan enkripsi SSL. Kata sandi di-hash menggunakan bcrypt.",
        },
        {
          subtitle: "Retensi Data",
          text: "Riwayat percakapan disimpan selama akun aktif. Data akun dapat dihapus secara permanen dengan mengajukan permintaan ke tim dukungan.",
        },
        {
          subtitle: "Pemisahan Data",
          text: "Pemisahan ketat antar data pengguna. Anda hanya dapat melihat data milik Anda sendiri.",
        },
      ],
    },
    {
      title: "Hak Anda",
      content: [
        {
          subtitle: "Akses & Ekspor",
          text: "Anda dapat mengakses dan mengekspor riwayat percakapan kapan saja melalui panel samping.",
        },
        {
          subtitle: "Penghapusan Data",
          text: "Anda dapat menghapus riwayat percakapan individual atau seluruh akun. Permintaan penghapusan akun permanen dapat diajukan melalui email.",
        },
        {
          subtitle: "Opt-out",
          text: "Gunakan mode Tamu apabila tidak ingin data disimpan secara permanen.",
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
              className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white/90 transition-colors"
              aria-label="Go back"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-sm font-medium text-white">Privacy Policy</h1>
          </div>
          <span className="text-xs text-white/60">Legal</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Intro */}
        <section className="mb-10">
          <h2 className="text-2xl font-normal text-white mb-3">
            Kebijakan Privasi
          </h2>
          <p className="text-sm text-white/60 leading-relaxed">
            Terakhir diperbarui: April 2026. Kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi dengan serius.
          </p>
        </section>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h3 className="text-sm font-medium text-white/80 mb-4">
                {section.title}
              </h3>
              <div className="space-y-4">
                {section.content.map((item) => (
                  <div
                    key={item.subtitle}
                    className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]"
                  >
                    <h4 className="text-xs font-medium text-white/70 mb-2">
                      {item.subtitle}
                    </h4>
                    <p className="text-xs text-white/60 leading-relaxed">
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
            <h3 className="text-sm font-medium text-white/80 mb-2">
              Kontak Privasi
            </h3>
            <p className="text-xs text-white/60 leading-relaxed mb-3">
              Untuk pertanyaan terkait privasi, permintaan penghapusan data, atau pelaporan insiden keamanan:
            </p>
            <a
              href="mailto:privacy@cleverai.app"
              className="text-xs text-white/60 hover:text-white/90 transition-colors"
            >
              privacy@cleverai.app
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-[10px] text-white/45">
            Clever AI Privacy Policy • 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
