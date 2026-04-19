import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useState } from "react";
import logoIconUrl from "../assets/logo-icon.svg";

export default function Header({ onMenuToggle }) {
  const { lang, toggleLanguage, t } = useLanguage();
  const { isAuthenticated, isAuthReady, user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <header className="h-[60px] flex items-center justify-between px-4 bg-[#0a0a0a] border-b border-white/[0.06] flex-shrink-0 z-50">
        {/* Left: Sidebar Toggle */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white/90 hover:bg-white/[0.06] transition-all duration-200"
          aria-label={t("openSidebar")}
          title={t("openSidebar")}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Right: Language Toggle + Auth Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-all duration-200"
            aria-label={t("language")}
          >
            <span className={lang === "en" ? "text-white" : ""}>EN</span>
            <span className="text-white/20">|</span>
            <span className={lang === "id" ? "text-white" : ""}>ID</span>
          </button>

          <div className="w-px h-5 bg-white/[0.08] mx-1" />

          {/* Auth Section */}
          {!isAuthReady ? (
            <div className="flex items-center gap-2">
              <div className="w-16 h-7 rounded bg-white/[0.08] animate-pulse" />
              <div className="w-24 h-7 rounded bg-white/[0.08] animate-pulse" />
            </div>
          ) : !isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hidden sm:flex px-3 py-1.5 text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                {t("signIn")}
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-black bg-white hover:bg-white/90 transition-all duration-200"
              >
                {t("createAccount")}
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/[0.15] flex items-center justify-center overflow-hidden">
                {user?.picture ? (
                  <img src={user.picture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-medium text-white/80">
                    {getInitials(user?.name)}
                  </span>
                )}
              </div>

              {/* Sign Out Button - Desktop */}
              <button
                onClick={handleLogoutClick}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>{t("signOut")}</span>
              </button>

              {/* Sign Out Button - Mobile (icon only) */}
              <button
                onClick={handleLogoutClick}
                className="sm:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                title={t("signOut")}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCancelLogout}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div
              className="w-full max-w-xs bg-[#141414] rounded-xl border border-white/[0.08] p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-semibold text-white/95 mb-2">
                {t("signOutTitle")}
              </h3>
              <p className="text-sm text-white/50 mb-5 leading-relaxed">
                {t("signOutMessage")}
              </p>
              <div className="flex flex-col-reverse gap-2">
                <button
                  onClick={handleCancelLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white/50 transition-all duration-200 hover:text-white/70"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-black bg-white hover:bg-white/90 transition-all duration-200"
                >
                  {t("signOut")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}