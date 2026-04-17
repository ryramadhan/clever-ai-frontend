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

    // Logout Confirmation
    signOutTitle: "Sign out",
    signOutMessage: "You'll need to sign in again to access your history.",
    signOut: "Sign out",
    cancel: "Cancel",

    // Result
    resultPlaceholder: "The answer will appear here",
    aiGenerated: "AI Generated",
    mock: "Fallback",

    // Language
    language: "Language",

    // Sidebar
    menu: "Menu",
    closeSidebar: "Close menu",
    openSidebar: "Open menu",
    newChat: "New Chat",
    searchHistory: "Search history...",
    noSearchResults: "No results found",
    untitledChat: "Untitled Chat",
    guestUser: "Guest",
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

    // Logout Confirmation
    signOutTitle: "Keluar",
    signOutMessage: "Anda perlu masuk kembali untuk mengakses riwayat.",
    signOut: "Keluar",
    cancel: "Batal",

    // Result
    resultPlaceholder: "Jawaban akan muncul di sini",
    aiGenerated: "Dihasilkan AI",
    mock: "Fallback",

    // Language
    language: "Bahasa",

    // Sidebar
    menu: "Menu",
    closeSidebar: "Tutup menu",
    openSidebar: "Buka menu",
    newChat: "Chat Baru",
    searchHistory: "Cari riwayat...",
    noSearchResults: "Tidak ada hasil",
    untitledChat: "Chat Tanpa Judul",
    guestUser: "Tamu",
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