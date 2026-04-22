import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext.jsx";

export default function GuestSearchCta({ onClose, newChatCounter }) {
  const { t } = useLanguage();
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    setShowCta(false);
  }, [newChatCounter]);

  return (
    <div className="flex flex-col h-full">
      {/* Search Button */}
      <div className="pb-2">
        <button
          onClick={() => setShowCta(true)}
          className="w-full relative pl-9 pr-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-left text-sm text-white/50 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-200"
        >
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {t("searchHistory")}
        </button>
      </div>

      {/* CTA Card - Inline for all devices, no keyboard focus */}
      {showCta && (
        <div className="mt-2">
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <p className="text-sm font-medium text-white mb-2">
              {t("accessYourHistory")}
            </p>
            <p className="text-xs text-white/60 leading-relaxed mb-4">
              {t("signInToBrowse")}
            </p>
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                onClick={onClose}
                className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-black bg-white hover:bg-white/90 transition-all duration-200"
              >
                {t("signIn")}
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white/90 bg-white/[0.06] border border-white/[0.10] hover:bg-white/[0.10] hover:text-white transition-all duration-200"
              >
                {t("createAccount")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
