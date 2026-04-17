import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import SidebarHistory from "./SidebarHistory.jsx";
import SidebarUserFooter from "./SidebarUserFooter.jsx";
import SidebarGuestFooter from "./SidebarGuestFooter.jsx";
import GuestSearchCta from "./GuestSearchCta.jsx";
import logoIconUrl from "../../assets/logo-icon.svg";

const SIDEBAR_WIDTH = "w-[280px]";
const DESKTOP_ASIDE_CLASSES = [
  "fixed left-0 top-0 h-screen z-[60] bg-[#0a0a0a] border-r border-white/[0.06]",
  SIDEBAR_WIDTH,
  "transform-gpu transition-transform duration-300 ease-out",
].join(" ");
const LOGO_LINK_CLASSES = "w-8 h-8 flex items-center justify-center text-white/80 hover:opacity-80 transition-opacity duration-200";

function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return;
    if (typeof window !== "undefined") {
      if (window.matchMedia?.("(min-width: 1024px)").matches) return;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [locked]);
}

export default function Sidebar({
  isOpen,
  onToggle,
  onClose,
  historyItems,
  historyLoading,
  onRefreshHistory,
  onHistoryItemClick,
  onNewChat,
}) {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [newChatCounter, setNewChatCounter] = useState(0);

  // Lock scroll only when a backdrop covers content (mobile).
  useLockBodyScroll(isOpen);

  const didInitRef = useRef(false);
  useLayoutEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    if (isOpen) return;
    if (typeof onToggle !== "function") return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia?.("(min-width: 1024px)").matches) return;
    onToggle();
  }, [isOpen, onToggle]);

  return (
    <>
      <div className="hidden lg:block">
        <div
          className={[
            "fixed inset-0 z-[55] bg-black/0 transition-opacity duration-300 pointer-events-none",
            isOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
          aria-hidden="true"
        />
        <aside
          className={`${DESKTOP_ASIDE_CLASSES} ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
          aria-label={t("menu")}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-4 min-h-[81px] border-b border-white/[0.06]">
              <div className="flex items-center gap-3 min-w-0">
                <Link
                  to="/"
                  className={LOGO_LINK_CLASSES}
                  aria-label={t("appTitle")}
                  title={t("appTitle")}
                >
                  <img src={logoIconUrl} alt="" className="w-full h-full object-contain" />
                </Link>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/10"
                aria-label={t("closeSidebar")}
                title={t("closeSidebar")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-3">
              <button
                type="button"
                onClick={() => {
                  onNewChat();
                  setNewChatCounter(c => c + 1);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.10] text-white/90 hover:bg-white/[0.10] hover:border-white/[0.15] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm font-medium">{t("newChat")}</span>
              </button>
            </div>
            {isAuthenticated && (
              <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                <SidebarHistory
                  items={historyItems}
                  loading={historyLoading}
                  onRefresh={onRefreshHistory}
                  onItemClick={onHistoryItemClick}
                />
              </div>
            )}
            {!isAuthenticated && (
              <div className="px-3 pb-3">
                <GuestSearchCta onClose={onClose} newChatCounter={newChatCounter} />
              </div>
            )}
            {isAuthenticated ? (
              <SidebarUserFooter onAction={onClose} />
            ) : (
              <SidebarGuestFooter onAction={onClose} />
            )}
          </div>
        </aside>
      </div>

      <div
        className={`
          lg:hidden fixed inset-0 z-[60] transition-all duration-300
          ${isOpen ? "visible" : "invisible"}
        `}
      >
        <div
          className={`
            absolute inset-0 bg-black/60
            transition-opacity duration-300
            ${isOpen ? "opacity-100" : "opacity-0"}
          `}
          onClick={onClose}
        />
        <aside
          className={`
            absolute left-0 top-0 h-full w-[85vw] max-w-[300px]
            bg-[#0a0a0a] border-r border-white/[0.06]
            flex flex-col
            transform-gpu transition-transform duration-300 ease-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          aria-label={t("menu")}
        >
          <div className="flex items-center justify-between px-4 py-3 min-h-[81px] border-b border-white/[0.06]">
            <Link
              to="/"
              className={LOGO_LINK_CLASSES}
              aria-label={t("appTitle")}
              title={t("appTitle")}
            >
              <img src={logoIconUrl} alt="" className="w-full h-full object-contain" />
            </Link>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all duration-200"
              aria-label={t("closeSidebar")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-3">
            <button
              type="button"
              onClick={() => {
                onNewChat();
                setNewChatCounter(c => c + 1);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.10] text-white/90 hover:bg-white/[0.10] hover:border-white/[0.15] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium">{t("newChat")}</span>
            </button>
          </div>
          {isAuthenticated && (
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <SidebarHistory
                items={historyItems}
                loading={historyLoading}
                onRefresh={onRefreshHistory}
                onItemClick={(item) => {
                  onHistoryItemClick(item);
                  onClose();
                }}
              />
            </div>
          )}
          {!isAuthenticated && (
            <div className="px-3 pb-3">
              <GuestSearchCta onClose={onClose} newChatCounter={newChatCounter} />
            </div>
          )}
          {isAuthenticated ? (
            <SidebarUserFooter onAction={onClose} />
          ) : (
            <SidebarGuestFooter onAction={onClose} />
          )}
        </aside>
      </div>
    </>
  );
}
