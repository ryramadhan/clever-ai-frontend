import { createContext, useContext, useState, useCallback } from "react";

const translations = {
  en: {
    // Header
    appTitle: "Clever AI",
    appSubtitle: "Ask anything",

    // Hero
    heroTitle: "How can I help you today?",
    heroSubtitle: "Ask a question or describe what you need.",

    // Form labels
    contextLabel: "Your Question",
    contextPlaceholder: "Type your question here...",
    contextHint: "Be specific.",

    // Buttons
    generate: "Get Answer",
    generating: "Thinking...",
    refresh: "Refresh",
    loadMore: "Load more",
    copy: "Copy",
    copied: "Copied",

    // Toggle
    typewriterEffect: "Typewriter effect",

    // History
    historyTitle: "History",
    noHistory: "No history yet",
    loading: "Loading...",
    publicBadge: "Public",
    personalBadge: "Personal",
    guestBannerText: "Showing community history.",
    guestBannerLink: "Sign in to save your own",
    emptyStateTitle: "No history yet",
    emptyStateSubtitle: "Your saved conversations will appear here",
    signInToSave: "Sign in to save",
    privateCtaText: "Want to keep your conversations private?",
    createAccount: "Create an account",

    // Guest CTA
    savePrompt: "Want to save this conversation?",

    // Result
    resultPlaceholder: "The answer will appear here",
    aiGenerated: "AI Generated",
    mock: "Fallback",

    // Language
    language: "Language",
  },
  id: {
    // Header
    appTitle: "Clever AI",
    appSubtitle: "Tanya apa saja",

    // Hero
    heroTitle: "Ada yang bisa saya bantu?",
    heroSubtitle: "Ajukan pertanyaan atau jelaskan apa yang Anda butuhkan.",

    // Form labels
    contextLabel: "Pertanyaan Anda",
    contextPlaceholder: "Ketik pertanyaan di sini...",
    contextHint: "Lebih spesifik.",

    // Buttons
    generate: "Dapatkan Jawaban",
    generating: "Memikirkan...",
    refresh: "Muat Ulang",
    loadMore: "Muat Lebih",
    copy: "Salin",
    copied: "Tersalin",

    // Toggle
    typewriterEffect: "Efek ketik",

    // History
    historyTitle: "Riwayat",
    noHistory: "Belum ada riwayat",
    loading: "Memuat...",
    publicBadge: "Publik",
    personalBadge: "Pribadi",
    guestBannerText: "Menampilkan riwayat komunitas.",
    guestBannerLink: "Masuk untuk menyimpan milik Anda",
    emptyStateTitle: "Belum ada riwayat",
    emptyStateSubtitle: "Percakapan tersimpan akan muncul di sini",
    signInToSave: "Masuk untuk menyimpan",
    privateCtaText: "Ingin menjaga percakapan Anda tetap pribadi?",
    createAccount: "Buat akun",

    // Guest CTA
    savePrompt: "Ingin menyimpan percakapan ini?",

    // Result
    resultPlaceholder: "Jawaban akan muncul di sini",
    aiGenerated: "Dihasilkan AI",
    mock: "Fallback",

    // Language
    language: "Bahasa",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  const toggleLanguage = useCallback(() => {
    setLang((prev) => (prev === "en" ? "id" : "en"));
  }, []);

  const t = useCallback(
    (key) => {
      return translations[lang][key] || key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
