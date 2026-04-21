import { useNavigate } from "react-router-dom";

export default function TermsPage() {
  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
  }

  const sections = [
    {
      title: "Penerimaan Syarat",
      content:
        "Dengan mengakses atau menggunakan MoodWrite AI, kamu menyetujui untuk terikat oleh syarat dan ketentuan ini. Jika tidak setuju, harap tidak menggunakan layanan kami.",
    },
    {
      title: "Kelayakan Pengguna",
      content:
        "Kamu harus berusia minimal 13 tahun untuk menggunakan layanan ini. Jika di bawah 18 tahun, kamu harus memiliki persetujuan orang tua atau wali.",
    },
    {
      title: "Akun Pengguna",
      content:
        "Kamu bertanggung jawab untuk menjaga kerahasiaan password dan membatasi akses ke akunmu. Beritahu kami segera jika ada penggunaan tidak sah.",
    },
    {
      title: "Penggunaan yang Diterima",
      content:
        "Kamu setuju untuk tidak menggunakan layanan untuk: (a) aktivitas ilegal, (b) spam atau abuse, (c) menghasilkan konten berbahaya, (d) mengganggu layanan lain, (e) scraping data tanpa izin.",
    },
    {
      title: "Konten AI & Hak Cipta",
      content:
        "Output AI disediakan untuk penggunaan personal. Kamu bertanggung jawab atas penggunaan output dan memastikan tidak melanggar hak cipta pihak ketiga. Kami tidak mengklaim kepemilikan atas output AI.",
    },
    {
      title: "Batasan Layanan",
      content:
        "Layanan ini 'sebagaimana adanya'. Kami tidak menjamin: (a) akurasi output AI, (b) ketersediaan tanpa gangguan, (c) keamanan absolut. Gunakan dengan risiko kamu sendiri.",
    },
    {
      title: "Pembatasan Tanggung Jawab",
      content:
        "Kami tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial. Tanggung jawab total kami terbatas pada jumlah yang kamu bayar (jika ada) atau $100.",
    },
    {
      title: "Penghentian",
      content:
        "Kami berhak menangguhkan atau menghentikan akses kamu kapan saja untuk pelanggaran syarat ini. Kamu bisa menghapus akun kapan saja.",
    },
    {
      title: "Perubahan Syarat",
      content:
        "Kami bisa mengubah syarat ini kapan saja. Perubahan efektif saat diposting. Penggunaan berkelanjutan berarti penerimaan perubahan.",
    },
    {
      title: "Hukum yang Berlaku",
      content:
        "Syarat ini diatur oleh hukum Indonesia. Sengketa diselesaikan di pengadilan Jakarta.",
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
            <h1 className="text-sm font-medium text-white/80">Terms of Service</h1>
          </div>
          <span className="text-xs text-white/40">Legal</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Intro */}
        <section className="mb-10">
          <h2 className="text-2xl font-normal text-white/90 mb-3">
            Syarat Penggunaan
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Terakhir diupdate: April 2024. Harap baca dengan seksama sebelum menggunakan layanan.
          </p>
        </section>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <section key={section.title}>
              <div className="flex items-start gap-3">
                <span className="text-xs text-white/30 mt-0.5">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-2">
                    {section.title}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Agreement */}
        <section className="mt-10 pt-8 border-t border-white/[0.06]">
          <div className="p-4 rounded-lg bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08]">
            <p className="text-xs text-white/50 leading-relaxed">
              Dengan menggunakan MoodWrite AI, kamu mengakni bahwa telah membaca, memahami, dan menyetujui syarat dan ketentuan ini.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-6">
          <p className="text-xs text-white/40">
            Pertanyaan tentang syarat ini? Hubungi{" "}
            <a href="mailto:legal@cleverai.app" className="text-white/50 hover:text-white/70 transition-colors">
              legal@cleverai.app
            </a>
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-[10px] text-white/20">
            MoodWrite AI Terms of Service • 2024
          </p>
        </footer>
      </main>
    </div>
  );
}
