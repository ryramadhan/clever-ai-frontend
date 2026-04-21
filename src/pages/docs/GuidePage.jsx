import { useNavigate } from "react-router-dom";

export default function GuidePage() {
  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
  }

  const sections = [
    {
      title: "Getting Started",
      items: [
        {
          question: "Apa itu MoodWrite AI?",
          answer:
            "MoodWrite AI adalah asisten AI untuk membantu kamu berkreasi dengan ide-ide menarik. Kamu bisa chat dengan AI secara real-time dan mendapatkan respons streaming seperti ChatGPT.",
        },
        {
          question: "Bagaimana cara mulai chat?",
          answer:
            'Cukup ketik pertanyaan atau topik yang ingin kamu diskusikan di kotak input, lalu tekan Enter atau klik tombol kirim. AI akan merespons secara real-time dengan streaming text.',
        },
        {
          question: "Apakah perlu login?",
          answer:
            "Tidak wajib. Kamu bisa menggunakan MoodWrite AI sebagai Guest tanpa login. Namun, history chat hanya akan tersimpan jika kamu login.",
        },
      ],
    },
    {
      title: "Features",
      items: [
        {
          question: "Streaming Response",
          answer:
            "AI merespons secara real-time dengan efek typing seperti ChatGPT. Kamu bisa melihat respons muncul huruf demi huruf.",
        },
        {
          question: "History Management",
          answer:
            "Setiap percakapan tersimpan di sidebar kiri. Kamu bisa melihat history, rename, pin, atau menghapus percakapan.",
        },
        {
          question: "Bilingual Support",
          answer:
            "MoodWrite AI mendukung Bahasa Indonesia dan English. AI akan otomatis merespons sesuai bahasa yang kamu gunakan.",
        },
        {
          question: "Copy & Share",
          answer:
            "Kamu bisa menyalin respons AI dengan satu klik menggunakan tombol copy di setiap pesan AI.",
        },
      ],
    },
    {
      title: "Tips & Best Practices",
      items: [
        {
          question: "Bagaimana pertanyaan yang bagus?",
          answer:
            "Jelaskan konteks dengan detail. Seperti: 'Berikan tips produktivitas untuk programmer yang kerja remote' daripada hanya 'tips produktivitas'.",
        },
        {
          question: "Batasan karakter",
          answer:
            "Input maksimal 2000 karakter. Jika topik kompleks, pecah menjadi beberapa pertanyaan spesifik.",
        },
        {
          question: "Follow-up questions",
          answer:
            'Kamu bisa melanjutkan percakapan dengan pertanyaan lanjutan. AI akan mengingat konteks percakapan sebelumnya.',
        },
      ],
    },
    {
      title: "Troubleshooting",
      items: [
        {
          question: "AI tidak merespons?",
          answer:
            'Coba refresh halaman atau klik "New Chat". Jika masalah berlanjut, cek koneksi internet atau coba lagi nanti.',
        },
        {
          question: "History hilang?",
          answer:
            "History Guest hanya tersimpan di device ini. Login untuk menyimpan history di cloud dan mengaksesnya dari device lain.",
        },
        {
          question: "Error 429 (Rate Limited)?",
          answer:
            "Terlalu banyak request dalam waktu singkat. Tunggu 1 menit sebelum mencoba lagi.",
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
            <h1 className="text-sm font-medium text-white/80">Documentation</h1>
          </div>
          <span className="text-xs text-white/40">User Guide</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Intro */}
        <section className="mb-10">
          <h2 className="text-2xl font-normal text-white/90 mb-3">
            Panduan Pengguna
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Pelajari cara menggunakan MoodWrite AI secara efektif. Dari dasar hingga tips advanced.
          </p>
        </section>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item.question}
                    className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors"
                  >
                    <h4 className="text-sm font-medium text-white/70 mb-2">
                      {item.question}
                    </h4>
                    <p className="text-xs text-white/40 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Need Help */}
        <section className="mt-10 pt-8 border-t border-white/[0.06]">
          <div className="p-5 rounded-lg bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08]">
            <h3 className="text-sm font-medium text-white/80 mb-2">
              Butuh bantuan lebih lanjut?
            </h3>
            <p className="text-xs text-white/40 mb-4">
              Jika kamu menemukan bug atau memiliki pertanyaan teknis, silakan buat issue di GitHub.
            </p>
            <a
              href="https://github.com/ryramadhan/moodwrite-ai-frontend/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.12] text-xs text-white/70 hover:bg-white/[0.10] hover:text-white transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              Report Issue on GitHub
              <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-[10px] text-white/20">
            MoodWrite AI Documentation • Last updated April 2024
          </p>
        </footer>
      </main>
    </div>
  );
}
