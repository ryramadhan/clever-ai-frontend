import { createContext, useContext, useState, useCallback } from "react";

const translations = {
  en: {
    // Header
    appTitle: "Clever AI",
    appSubtitle: "Ask anything",

    // Hero
    heroTitle: "How can I help you today?",
    heroSubtitle: "Ask a question or describe what you need.",

    // Input
    contextLabel: "Context",
    contextPlaceholder: "Ask anything...",
    contextHint: "Provide details for better results",
    generate: "Generate",
    generating: "Generating...",
    typewriterEffect: "Typewriter effect",
    charLimit: "{current}/{max} characters",
    pressEnterToSend: "Press Enter to send, Shift+Enter for new line",
    askFollowUp: "Ask a follow-up...",
    aiMayProduceInaccurate: "AI may produce inaccurate information. Verify important details.",
    copy: "Copy",
    copied: "Copied",

    // History
    historyTitle: "History",
    noHistory: "No history yet",
    loading: "Loading...",
    refresh: "Refresh",
    publicBadge: "Public",
    personalBadge: "Personal",
    guestBannerText: "Showing community history.",
    guestBannerLink: "Sign in to save your own",
    emptyStateTitle: "No history yet",
    emptyStateSubtitle: "Your saved conversations will appear here",
    signInToSave: "Sign in to save",
    privateCtaText: "Want to keep your conversations private?",
    createAccount: "Sign Up",

    // Guest CTA
    savePrompt: "Sign in to save this prompt and access your history.",
    personalizedResponse: "Save your conversations",
    signInBenefits: "Sign in to access your chat history across devices. Your data stays private and secure.",
    signIn: "Sign In",
    accessYourHistory: "Access your history",
    signInToBrowse: "Sign in to browse and continue your previous conversations.",
    likeWhatYouSee: "Like what you see?",
    signInToSaveAndHistory: "Sign in to save this result and access your full history.",
    browsePreviousAnswers: "Browse previous answers",
    continueConversations: "Continue where you left off",

    // Logout Confirmation
    signOutTitle: "Sign out",
    signOutMessage: "You'll need to sign in again to access your history.",
    signOut: "Sign out",
    cancel: "Cancel",

    // Result
    resultPlaceholder: "The answer will appear here",
    aiGenerated: "AI Generated",
    mock: "Fallback",
    copy: "Copy",
    copied: "Copied",
    regenerate: "Regenerate",

    // Language
    language: "Language",

    // Sidebar
    menu: "Menu",
    closeSidebar: "Close menu",
    openSidebar: "Open menu",
    collapseSidebar: "Collapse sidebar",
    signInToAccess: "Sign in to access your history",
    newChat: "New Chat",
    history: "History",
    searchHistory: "Search history...",
    noSearchResults: "No results found",
    untitledChat: "Untitled Chat",
    guestUser: "Guest",

    // History Item Actions
    renameChat: "Rename",
    pinChat: "Pin",
    unpinChat: "Unpin",
    deleteChat: "Delete",
    confirmDeleteTitle: "Delete chat?",
    confirmDeleteMessage: "This will permanently delete this conversation. This action cannot be undone.",
    renameHint: "Enter to save, Esc to cancel",
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
    contextPlaceholder: "Tanyakan apa saja...",
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
    pressEnterToSend: "Tekan Enter untuk kirim, Shift+Enter untuk baris baru",
    askFollowUp: "Tanyakan lanjutan...",
    aiMayProduceInaccurate: "AI dapat menghasilkan informasi yang tidak akurat. Verifikasi detail penting.",

    // History
    historyTitle: "Riwayat",
    noHistory: "Belum ada riwayat",
    loading: "Memuat...",
    refresh: "Muat Ulang",
    publicBadge: "Publik",
    personalBadge: "Pribadi",
    guestBannerText: "Menampilkan riwayat komunitas.",
    guestBannerLink: "Masuk untuk menyimpan milik Anda",
    emptyStateTitle: "Belum ada riwayat",
    emptyStateSubtitle: "Percakapan tersimpan akan muncul di sini",
    signInToSave: "Masuk untuk menyimpan",
    privateCtaText: "Ingin menjaga percakapan Anda tetap pribadi?",
    createAccount: "Mendaftar",

    // Guest CTA
    savePrompt: "Masuk untuk menyimpan prompt ini dan mengakses riwayat.",
    personalizedResponse: "Simpan percakapan Anda",
    signInBenefits: "Masuk untuk mengakses riwayat chat Anda di semua perangkat. Data Anda tetap pribadi dan aman.",
    signIn: "Masuk",
    accessYourHistory: "Akses riwayat Anda",
    signInToBrowse: "Masuk untuk menelusuri dan melanjutkan percakapan sebelumnya.",
    likeWhatYouSee: "Suka dengan hasilnya?",
    signInToSaveAndHistory: "Masuk untuk menyimpan hasil ini dan mengakses riwayat lengkap.",
    browsePreviousAnswers: "Telusuri jawaban sebelumnya",
    continueConversations: "Lanjutkan percakapan",

    // Logout Confirmation
    signOutTitle: "Keluar",
    signOutMessage: "Anda perlu masuk kembali untuk mengakses riwayat.",
    signOut: "Keluar",
    cancel: "Batal",

    // Result
    resultPlaceholder: "Jawaban akan muncul di sini",
    aiGenerated: "Dihasilkan AI",
    mock: "Fallback",
    copy: "Salin",
    copied: "Tersalin",
    regenerate: "Buat Ulang",

    // Language
    language: "Bahasa",

    // Sidebar
    menu: "Menu",
    closeSidebar: "Tutup menu",
    openSidebar: "Buka menu",
    collapseSidebar: "Ciutkan sidebar",
    signInToAccess: "Masuk untuk mengakses riwayat",
    newChat: "Chat Baru",
    history: "Riwayat",
    searchHistory: "Cari riwayat...",
    noSearchResults: "Tidak ada hasil",
    untitledChat: "Chat Tanpa Judul",
    guestUser: "Tamu",

    // History Item Actions
    renameChat: "Ganti nama",
    pinChat: "Sematkan",
    unpinChat: "Lepas semat",
    deleteChat: "Hapus",
    confirmDeleteTitle: "Hapus obrolan?",
    confirmDeleteMessage: "Tindakan ini akan menghapus percakapan secara permanen. Tidak dapat dibatalkan.",
    renameHint: "Enter untuk simpan, Esc untuk batal",
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