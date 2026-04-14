import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function Header() {
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-white/[0.06]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.10] flex items-center justify-center text-white/80">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="text-lg font-semibold tracking-tight text-white/95">{t("appTitle")}</div>
              <div className="text-sm text-white/60">{t("appSubtitle")}</div>
            </div>
          </div>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.10] text-sm text-white/70 transition-all duration-200 hover:bg-white/[0.10] hover:text-white hover:border-white/[0.20]"
            aria-label={t("language")}
          >
            <span className={`${lang === "en" ? "text-white font-medium" : ""}`}>EN</span>
            <span className="text-white/30">|</span>
            <span className={`${lang === "id" ? "text-white font-medium" : ""}`}>ID</span>
          </button>
        </div>
      </div>
    </header>
  );
}

