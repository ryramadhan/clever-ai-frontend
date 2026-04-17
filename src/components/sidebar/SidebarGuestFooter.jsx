import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext.jsx";

export default function SidebarGuestFooter({ onAction }) {
  const { t } = useLanguage();

  return (
    <div className="mt-auto border-t border-white/[0.06] p-3">
      <div className="px-3 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08]">
        <p className="text-sm font-medium text-white/90 mb-1">
          {t("personalizedResponse")}
        </p>
        <p className="text-xs text-white/50 leading-relaxed mb-3">
          {t("signInBenefits")}
        </p>
        <div className="h-px bg-white/[0.08] mb-3" />
        <Link
          to="/login"
          onClick={onAction}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-black bg-white hover:bg-white/90 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          {t("signIn")}
        </Link>
      </div>
    </div>
  );
}
