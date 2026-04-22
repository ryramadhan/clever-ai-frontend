import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import ChatHistorySkeleton from "./ChatHistorySkeleton.jsx";

function truncateContext(context, maxLength = 60) {
  if (!context) return "";
  if (context.length <= maxLength) return context;
  return context.substring(0, maxLength) + "...";
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // ignore
  }
}

function useDelayedLoading(loading, delay = 200) {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (!loading) {
      setShowLoading(false);
      return;
    }
    const timer = setTimeout(() => setShowLoading(true), delay);
    return () => clearTimeout(timer);
  }, [loading, delay]);

  return showLoading;
}

export default function HistoryList({
  items,
  loading,
  error,
  onRefresh,
  onLoadMore,
  canLoadMore,
  loadingMore,
  isAuthenticated,
}) {
  const { t } = useLanguage();
  const showLoading = useDelayedLoading(loading, 200);
  const hasItems = items && items.length > 0;

  return (
    <section className="w-full mt-10">
      {/* Header dengan mode indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-white">{t("historyTitle")}</h2>
          {!isAuthenticated && hasItems && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-white/[0.04] text-white/60 border border-white/[0.08]">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t("publicBadge")}
            </span>
          )}
          {isAuthenticated && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-white/[0.04] text-white/60 border border-white/[0.08]">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t("personalBadge")}
            </span>
          )}
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-transparent border border-white/[0.08] text-sm text-white/60 transition-all duration-200 hover:bg-white/[0.05] hover:text-white/90 hover:border-white/[0.15] disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={onRefresh}
          disabled={loading || loadingMore}
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
          )}
          <span className="hidden sm:inline">{loading ? t("loading") : t("refresh")}</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
          {error}
        </div>
      )}

      {/* Skeleton Loading State */}
      {showLoading && !hasItems && (
        <ChatHistorySkeleton count={5} />
      )}

      {/* Guest Context Banner - when community data exists */}
      {!loading && hasItems && !isAuthenticated && (
        <div className="mb-4 p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <p className="text-xs sm:text-sm text-white/60 text-center">
            {t("guestBannerText")}
          </p>
        </div>
      )}

      {/* Empty state - Guest Mode */}
      {!loading && !hasItems && !isAuthenticated && (
        <div className="text-center py-12 sm:py-14 px-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 sm:mb-5 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/45" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>

          <p className="text-sm sm:text-base font-medium text-white/60 mb-1.5 sm:mb-2">
            {t("emptyStateTitle")}
          </p>
          <p className="text-xs sm:text-sm text-white/60 mb-5 sm:mb-6 max-w-xs mx-auto leading-relaxed">
            {t("emptyStateSubtitle")}
          </p>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.10] text-sm text-white/90 transition-all duration-200 hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            {t("signInToSave")}
          </Link>
        </div>
      )}

      {/* Empty state - Logged in but no history */}
      {!loading && !hasItems && isAuthenticated && (
        <div className="text-center py-10 sm:py-12 px-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>

          <p className="text-xs sm:text-sm text-white/60">
            {t("noHistory")}
          </p>
        </div>
      )}

      {/* History list - authenticated users lihat personal, guest lihat community */}
      {hasItems && (
        <div className={`space-y-3 ${loading ? "opacity-60" : ""}`}>
          {items.map((it, index) => (
            <article
              key={it.id}
              className="bg-[#141414] rounded-xl border border-white/[0.06] p-3 sm:p-4 transition-all duration-300 hover:border-white/[0.12] animate-fade-in"
              style={{ animationDelay: `${index * 50}ms`, opacity: 0, animationFillMode: "forwards" }}
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/60">{formatDate(it.created_at)}</span>
                  {!isAuthenticated && (
                    <span className="text-[10px] text-white/45 px-1.5 py-0.5 rounded border border-white/[0.06]">
                      {t("publicBadge")}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/[0.06] border border-white/[0.10] flex items-center justify-center text-white/60 transition-all duration-150 hover:bg-white/[0.10] hover:text-white disabled:opacity-30"
                  onClick={() => copyToClipboard(it.result)}
                  title="Copy result"
                  aria-label="Copy result"
                  disabled={loading}
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>

              {/* Input context */}
              {it.context && (
                <div className="text-xs sm:text-sm text-white/60 italic mb-1.5 sm:mb-2">Q: "{truncateContext(it.context)}"</div>
              )}

              {/* Result */}
              <div className="text-sm sm:text-base text-white leading-relaxed">{it.result}</div>
            </article>
          ))}
        </div>
      )}

      {/* Load more */}
      {canLoadMore && (
        <div className="flex justify-center mt-5 sm:mt-6">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-transparent border border-white/[0.08] text-sm text-white/60 transition-all duration-200 hover:bg-white/[0.05] hover:text-white/90 hover:border-white/[0.15] disabled:opacity-40"
            onClick={onLoadMore}
            disabled={loading || loadingMore}
          >
            {loadingMore ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                {t("loading")}
              </>
            ) : (
              t("loadMore")
            )}
          </button>
        </div>
      )}

      {/* Subtle CTA at bottom for Guest with data */}
      {!loading && hasItems && !isAuthenticated && (
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/[0.06]">
          <p className="text-center text-xs text-white/45 mb-3">
            {t("privateCtaText")}
          </p>
          <div className="flex justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white/90 transition-colors group"
            >
              {t("createAccount")}
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
