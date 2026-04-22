import { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import SidebarChatHistory from "./SidebarChatHistory.jsx";
import ChatHistorySkeleton from "../chat/ChatHistorySkeleton.jsx";
import SidebarUserFooter from "./SidebarUserFooter.jsx";
import SidebarGuestFooter from "./SidebarGuestFooter.jsx";
import logoIconUrl from "../../assets/logo-icon.svg";

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
  onHistoryItemsChange,
}) {
  const { t } = useLanguage();
  const { isAuthenticated, isAuthReady } = useAuth();
  const [newChatCounter, setNewChatCounter] = useState(0);
  const [localHistoryItems, setLocalHistoryItems] = useState(historyItems);

  useEffect(() => {
    setLocalHistoryItems(historyItems);
  }, [historyItems]);

  const handleHistoryItemsChange = useCallback((newItems) => {
    setLocalHistoryItems(newItems);
    onHistoryItemsChange?.(newItems);
  }, [onHistoryItemsChange]);

  useLockBodyScroll(isOpen);

  const handleNewChatClick = async () => {
    await onNewChat();
    setNewChatCounter(c => c + 1);
  };

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
      <aside
        className={`
          hidden lg:flex flex-col h-screen sticky top-0
          bg-[#0a0a0a] border-r border-white/[0.06]
          transition-all duration-300 ease-out
          ${isOpen ? "w-60" : "w-16"}
        `}
        aria-label={t("menu")}
      >
        {/* Header */}
        <div className={`
          flex items-center
          ${isOpen ? "justify-between px-4 h-[60px]" : "justify-center px-2 h-[60px]"}
        `}>
          {isOpen ? (
            <>
              <Link
                to="/"
                className="w-7 h-7 flex items-center justify-center text-white hover:opacity-80 transition-opacity duration-200"
                aria-label={t("appTitle")}
                title={t("appTitle")}
              >
                <img src={logoIconUrl} alt="" className="w-full h-full object-contain" />
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                aria-label={t("collapseSidebar")}
                title={t("collapseSidebar")}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onToggle}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
              aria-label={t("openSidebar")}
              title={t("openSidebar")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>

        {/* New Chat Button */}
        <div className={isOpen ? "p-3" : "p-2 flex justify-center"}>
          <button
            type="button"
            onClick={handleNewChatClick}
            className={`
              flex items-center justify-center
              rounded-xl bg-white/[0.06] border border-white/[0.06] text-white
              hover:bg-white/[0.10] hover:border-white/[0.10] hover:text-white
              transition-all duration-200
              ${isOpen ? "w-full gap-3 px-4 py-2.5" : "w-10 h-10"}
            `}
            title={t("newChat")}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {isOpen && <span className="text-sm font-medium">{t("newChat")}</span>}
          </button>
        </div>

        {/* History Section */}
        {isAuthenticated && isOpen && (
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <SidebarChatHistory
              items={localHistoryItems}
              loading={historyLoading}
              onRefresh={onRefreshHistory}
              onItemClick={onHistoryItemClick}
              onItemsChange={handleHistoryItemsChange}
            />
          </div>
        )}

        {/* Guest: Minimal sidebar, no history */}
        {!isAuthenticated && isOpen && (
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                {t("signInToAccess")}
              </p>
            </div>
          </div>
        )}

        {/* Collapsed state - simple icons */}
        {!isOpen && isAuthenticated && (
          <div className="flex-1 flex flex-col items-center py-4 gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/45">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto">
          {!isAuthReady ? (
            <div className="px-3 py-3">
              <div className="h-10 rounded-lg bg-white/[0.08] animate-pulse" />
            </div>
          ) : isAuthenticated ? (
            <SidebarUserFooter isExpanded={isOpen} />
          ) : (
            isOpen && <SidebarGuestFooter onAction={() => { }} />
          )}
        </div>
      </aside>

      <div
        className={`
          lg:hidden fixed inset-0 z-[60]
          ${isOpen ? "pointer-events-auto" : "pointer-events-none"}
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
            absolute left-0 top-0 h-full w-[280px]
            bg-[#0a0a0a] border-r border-white/[0.06]
            flex flex-col pointer-events-auto
            transform-gpu transition-transform duration-300 ease-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          aria-label={t("menu")}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-4 py-3 h-[60px] border-b border-white/[0.06]">
            <Link
              to="/"
              className="w-7 h-7 flex items-center justify-center text-white/80"
              aria-label={t("appTitle")}
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

          {/* New Chat */}
          <div className="p-3">
            <button
              type="button"
              onClick={async () => {
                await handleNewChatClick();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.06] text-white/90 hover:bg-white/[0.10] hover:border-white/[0.10] transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium">{t("newChat")}</span>
            </button>
          </div>

          {/* History */}
          {isAuthenticated && (
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <SidebarChatHistory
                items={localHistoryItems}
                loading={historyLoading}
                onRefresh={onRefreshHistory}
                onItemClick={(item) => {
                  onHistoryItemClick(item);
                  onClose();
                }}
                onItemsChange={handleHistoryItemsChange}
              />
            </div>
          )}

          {/* Guest: Minimal hint */}
          {!isAuthenticated && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-xs text-white/40 text-center leading-relaxed">
                {t("signInToAccess")}
              </p>
            </div>
          )}

          {/* Footer */}
          {!isAuthReady ? (
            <div className="px-3 py-3">
              <div className="h-12 rounded-lg bg-white/[0.08] animate-pulse" />
            </div>
          ) : isAuthenticated ? (
            <SidebarUserFooter isExpanded={true} onAction={onClose} />
          ) : (
            <SidebarGuestFooter onAction={onClose} />
          )}
        </aside>
      </div>
    </>
  );
}