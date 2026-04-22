import { useNavigate } from "react-router-dom";

export default function TermsPage() {
  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
  }

  const sections = [
    {
      title: "Penerimaan Ketentuan",
      content:
        "Dengan mengakses atau menggunakan Clever AI, Anda menyetujui untuk terikat oleh seluruh syarat dan ketentuan yang tercantum dalam dokumen ini. Apabila tidak setuju, mohon untuk tidak menggunakan layanan kami.",
    },
    {
      title: "Kelayakan Pengguna",
      content:
        "Pengguna harus berusia minimal 13 tahun. Untuk pengguna di bawah 18 tahun, diperlukan persetujuan dari orang tua atau wali yang sah.",
    },
    {
      title: "Akun Pengguna",
      content:
        "Anda bertanggung jawab penuh untuk menjaga kerahasiaan kata sandi dan membatasi akses ke akun Anda. Segera hubungi kami jika terdapat penggunaan yang tidak sah.",
    },
    {
      title: "Penggunaan yang Diterima",
      content:
        "Anda setuju untuk tidak menggunakan layanan untuk: (a) kegiatan yang melanggar hukum, (b) spam atau penyalahgunaan, (c) menghasilkan konten yang berbahaya, (d) mengganggu layanan lain, (e) pengambilan data tanpa izin.",
    },
    {
      title: "Konten AI & Hak Cipta",
      content:
        "Output yang dihasilkan AI disediakan untuk penggunaan pribadi. Anda bertanggung jawab atas penggunaan output tersebut dan memastikan tidak melanggar hak cipta pihak ketiga. Kami tidak mengklaim kepemilikan atas output AI.",
    },
    {
      title: "Batasan Layanan",
      content:
        "Layanan disediakan 'sebagaimana adanya'. Kami tidak menjamin: (a) akurasi output AI, (b) ketersediaan tanpa gangguan, (c) keamanan absolut. Penggunaan dilakukan dengan risiko yang ditanggung sendiri.",
    },
    {
      title: "Pembatasan Tanggung Jawab",
      content:
        "Kami tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial. Total tanggung jawab kami terbatas pada jumlah yang telah dibayarkan (jika ada) atau sebesar $100.",
    },
    {
      title: "Penghentian Layanan",
      content:
        "Kami berhak untuk menangguhkan atau menghentikan akses Anda kapan saja apabila terjadi pelanggaran terhadap ketentuan ini. Anda juga dapat menghapus akun kapan saja sesuai kebijakan yang berlaku.",
    },
    {
      title: "Perubahan Ketentuan",
      content:
        "Kami berhak mengubah ketentuan ini sewaktu-waktu. Perubahan akan efektif sejak dipublikasikan. Penggunaan berkelanjutan menunjukkan penerimaan Anda terhadap perubahan tersebut.",
    },
    {
      title: "Hukum yang Berlaku",
      content:
        "Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum Republik Indonesia. Segala sengketa akan diselesaikan melalui pengadilan yang berwenang di Jakarta.",
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
            Ketentuan Layanan
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Terakhir diperbarui: April 2026. Harap baca dengan saksama sebelum menggunakan layanan.
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
              Dengan menggunakan Clever AI, Anda mengakui bahwa telah membaca, memahami, dan menyetujui seluruh ketentuan yang tercantum dalam dokumen ini.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-6">
          <p className="text-xs text-white/40">
            Memiliki pertanyaan terkait ketentuan layanan? Silakan hubungi{" "}
            <a href="mailto:legal@cleverai.app" className="text-white/50 hover:text-white/70 transition-colors">
              legal@cleverai.app
            </a>
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-[10px] text-white/20">
            Clever AI Terms of Service • 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
