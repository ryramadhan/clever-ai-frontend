import { createContext, useContext, useState, useCallback } from "react";

const translations = {
  en: {
    // Header
    appTitle: "MoodWrite",
    appSubtitle: "Caption Generator",

    // Hero
    heroTitle: "Stories in a single line.",
    heroSubtitle: "AI-generated captions for every mood.",

    // Mood labels
    moodLabel: "Mood",
    moodLonely: "Lonely",
    moodNight: "Night",
    moodNostalgic: "Nostalgic",
    moodLost: "Lost",
    moodCalm: "Calm",

    // Form labels
    contextLabel: "Context",
    contextPlaceholder: "Add context (optional)...",
    contextHint: "Add context to make your caption more personal.",

    // Buttons
    generate: "Generate",
    generating: "Creating...",
    refresh: "Refresh",
    loadMore: "Load more",
    copy: "Copy",
    copied: "Copied",

    // Toggle
    typewriterEffect: "Typewriter effect",

    // History
    historyTitle: "History",
    noHistory: "No history yet. Generate your first caption.",
    loading: "Loading...",

    // Result
    resultPlaceholder: "Your caption will appear here",
    aiGenerated: "AI Generated",
    mock: "Mock",

    // Language
    language: "Language",
  },
  id: {
    // Header
    appTitle: "MoodWrite",
    appSubtitle: "Generator Caption",

    // Hero
    heroTitle: "Cerita dalam satu kalimat.",
    heroSubtitle: "Caption AI untuk setiap suasana hati.",

    // Mood labels
    moodLabel: "Mood",
    moodLonely: "Sunyi",
    moodNight: "Malam",
    moodNostalgic: "Nostalgia",
    moodLost: "Kehilangan",
    moodCalm: "Tenang",

    // Form labels
    contextLabel: "Konteks",
    contextPlaceholder: "Tambahkan konteks (opsional)...",
    contextHint: "Tambahkan konteks agar caption lebih personal.",

    // Buttons
    generate: "Buat Caption",
    generating: "Membuat...",
    refresh: "Muat Ulang",
    loadMore: "Muat Lebih",
    copy: "Salin",
    copied: "Tersalin",

    // Toggle
    typewriterEffect: "Efek ketik",

    // History
    historyTitle: "Riwayat",
    noHistory: "Belum ada riwayat. Buat caption pertamamu.",
    loading: "Memuat...",

    // Result
    resultPlaceholder: "Caption akan muncul di sini",
    aiGenerated: "AI Generated",
    mock: "Mock",

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
