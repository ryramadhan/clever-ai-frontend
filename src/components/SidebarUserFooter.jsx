import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function SidebarUserFooter({ onAction }) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowConfirm(false);
    if (onAction) onAction();
  };

  const handleCancelLogout = () => {
    setShowConfirm(false);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div className="border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08]">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/[0.15] flex items-center justify-center flex-shrink-0 overflow-hidden">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium text-white/80">
                {getInitials(user?.name)}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white/90 truncate">
              {user?.name || t("guestUser")}
            </p>
            <p className="text-xs text-white/40 truncate">
              {user?.email || ""}
            </p>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleLogoutClick}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 flex-shrink-0"
            title={t("signOut")}
            aria-label={t("signOut")}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[70]">
          <div
            className="absolute inset-0 bg-black/60"
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
