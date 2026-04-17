import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import logoIconUrl from "../assets/logo-icon.svg";

const MOBILE_TRIGGER_BASE = [
  "lg:hidden fixed z-[70]",
  "left-3 top-3.5",
  "inline-flex items-center justify-center p-0",
  "w-11 h-11 rounded-xl overflow-hidden",
  "bg-[#0a0a0a]/40 backdrop-blur text-white/80",
  "border border-white/[0.10] hover:border-white/[0.15]",
  "hover:bg-white/[0.06] hover:text-white/95 active:bg-white/[0.10]",
  "transition-colors duration-200",
  "focus:outline-none focus:ring-2 focus:ring-white/10",
].join(" ");

export default function Header({ onMenuToggle, isMenuOpen }) {
  const { lang, toggleLanguage, t } = useLanguage();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-white/[0.06]">
      {onMenuToggle && (
        <>
          {isMenuOpen ? (
            <button
              type="button"
              onClick={onMenuToggle}
              className={MOBILE_TRIGGER_BASE}
              aria-label={t("closeSidebar")}
              title={t("closeSidebar")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <Link
              to="/"
              onClick={onMenuToggle}
              className={MOBILE_TRIGGER_BASE}
              aria-label={t("openSidebar")}
              title={t("openSidebar")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Link>
          )}
        </>
      )}

      {onMenuToggle && !isMenuOpen && (
        <Link
          to="/"
          onClick={onMenuToggle}
          className="hidden lg:flex fixed left-4 top-4 z-[70] w-9 h-9 flex items-center justify-center text-white/80 hover:opacity-80 transition-opacity duration-200"
          aria-label={t("openSidebar")}
          title={t("openSidebar")}
        >
          <img src={logoIconUrl} alt="" className="w-full h-full object-contain" />
        </Link>
      )}

      <div
        className={[
          "max-w-2xl mx-auto py-4",
          onMenuToggle ? "pl-[4.5rem] pr-4 sm:pl-6 sm:pr-6" : "px-4 sm:px-6",
        ].join(" ")}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 flex flex-col">
            <span className="text-lg font-semibold text-white/95">{t("appTitle")}</span>
            <span className="text-sm text-white/60">{t("appSubtitle")}</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {!isAuthenticated && (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link
                  to="/login"
                  className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full text-white/50 bg-white/[0.05] border border-white/[0.08] transition-all duration-300 hover:text-white hover:bg-white/[0.08]"
                  title="Sign in"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </Link>
                <Link
                  to="/login"
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-white/50 transition-all duration-300 hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full text-black bg-white shadow-md transition-all duration-300 hover:bg-white/90 hover:scale-105"
                  title="Sign up"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:block px-5 py-2 rounded-full text-sm font-medium text-black bg-white shadow-lg shadow-white/10 transition-all duration-300 hover:bg-white/90 hover:shadow-white/20 hover:scale-[1.02]"
                >
                  Sign up
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:px-2 text-xs font-medium tracking-wide text-white/30 transition-colors duration-200 hover:text-white/60"
              aria-label={t("language")}
            >
              <span className="sm:hidden">{lang.toUpperCase()}</span>
              <span className="hidden sm:flex sm:items-center sm:gap-1">
                <span className={`${lang === "en" ? "text-white" : ""}`}>EN</span>
                <span className="text-white/20">/</span>
                <span className={`${lang === "id" ? "text-white" : ""}`}>ID</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
