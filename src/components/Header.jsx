import { Link } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Header() {
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirmLogout(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowConfirmLogout(false);
  };

  const handleCancelLogout = () => {
    setShowConfirmLogout(false);
  };

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

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Auth Buttons - Desktop: Text, Mobile: Icon */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/40 hidden sm:block">
                  {user?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full text-white/60 bg-white/[0.05] border border-white/[0.08] transition-all duration-300 hover:bg-white/[0.10] hover:border-white/[0.15] hover:text-white"
                  title="Logout"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline sm:ml-2 text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Mobile: Icon only */}
                <Link
                  to="/login"
                  className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full text-white/50 bg-white/[0.05] border border-white/[0.08] transition-all duration-300 hover:text-white hover:bg-white/[0.08]"
                  title="Sign in"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </Link>
                {/* Desktop: Text */}
                <Link
                  to="/login"
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-white/50 transition-all duration-300 hover:text-white"
                >
                  Sign in
                </Link>

                {/* Mobile: Icon only */}
                <Link
                  to="/register"
                  className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full text-black bg-white shadow-md transition-all duration-300 hover:bg-white/90 hover:scale-105"
                  title="Sign up"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </Link>
                {/* Desktop: Text */}
                <Link
                  to="/register"
                  className="hidden sm:block px-5 py-2 rounded-full text-sm font-medium text-black bg-white shadow-lg shadow-white/10 transition-all duration-300 hover:bg-white/90 hover:shadow-white/20 hover:scale-[1.02]"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Language Toggle */}
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

      {/* Logout Confirmation Modal */}
      {showConfirmLogout && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 min-h-screen bg-black/80"
            onClick={handleCancelLogout}
          />
          {/* Modal Container */}
          <div className="absolute inset-0 flex items-center justify-center min-h-screen p-4 sm:p-6">
            <div
              className="w-full max-w-sm bg-[#141414] rounded-xl border border-white/[0.08] p-5 sm:p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <h3 className="text-lg font-semibold text-white/95 mb-2">
                {t("signOutTitle")}
              </h3>

              {/* Message */}
              <p className="text-sm text-white/50 mb-5 sm:mb-6 leading-relaxed">
                {t("signOutMessage")}
              </p>

              {/* Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleCancelLogout}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 transition-all duration-200 hover:text-white/70"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-black bg-white border border-white transition-all duration-200 hover:bg-white/90 hover:scale-[1.02]"
                >
                  {t("signOut")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

