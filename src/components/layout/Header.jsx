import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useState } from "react";
import logoIconUrl from "../../assets/logo-icon.svg";
import LogoutConfirmModal from "../modals/LogoutConfirmModal.jsx";

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
      <header className="h-[60px] flex items-center justify-between px-4 bg-[#0a0a0a] border-b border-white/[0.06] flex-shrink-0 z-50 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white/90 hover:bg-white/[0.06] transition-all duration-200"
            aria-label={t("openSidebar")}
            title={t("openSidebar")}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-base font-bold text-white tracking-tight">Clever AI</span>
        </div>

        <div className="flex items-center gap-2">
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
            <div className="w-8 h-8 rounded-full bg-white/[0.08] animate-pulse" />
          ) : !isAuthenticated ? (
            <div className="flex items-center gap-1">
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                {t("signIn")}
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-md text-sm font-medium text-black bg-white hover:bg-white/90 transition-all duration-200"
              >
                {t("signUp")}
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-white/10 border border-white/[0.12] flex items-center justify-center overflow-hidden">
                {user?.picture ? (
                  <img src={user.picture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-medium text-white/70">
                    {getInitials(user?.name)}
                  </span>
                )}
              </div>
            </button>
          )}
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        t={t}
      />
    </>
  );
}