import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext.jsx";

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
    <section className="w-full max-w-2xl mx-auto mt-10">
      {/* Header dengan Guest/Logged-in indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-white/95">{t("historyTitle")}</h2>
          {/* Subtle mode indicator */}
          {!isAuthenticated && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-white/[0.06] text-white/40 border border-white/[0.08]">
              Guest
            </span>
          )}
          {isAuthenticated && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-white/[0.06] text-white/40 border border-white/[0.08]">
              Personal
            </span>
          )}
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-transparent border border-white/[0.10] text-sm text-white/60 transition-all duration-200 hover:bg-white/[0.06] hover:text-white/80 hover:border-white/[0.20] disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={onRefresh}
          disabled={loading || loadingMore}
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          )}
          {loading ? t("loading") : t("refresh")}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-[10px] bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
          {error}
        </div>
      )}

      {/* Skeleton */}
      {showLoading && !hasItems && (
        <div className="space-y-3">
          <div className="h-24 rounded-[14px] bg-white/[0.04] animate-skeleton" />
          <div className="h-24 rounded-[14px] bg-white/[0.04] animate-skeleton" />
          <div className="h-24 rounded-[14px] bg-white/[0.04] animate-skeleton" />
        </div>
      )}

      {/* Empty state - Guest Mode (clean, professional) */}
      {!loading && !hasItems && !isAuthenticated && (
        <div className="text-center py-12 px-4">
          {/* Icon */}
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </div>

          <p className="text-sm text-white/50 mb-1">
            Guest Mode
          </p>
          <p className="text-sm text-white/30 mb-6 max-w-xs mx-auto">
            Login untuk menyimpan history pribadi dan mengakses dari perangkat mana saja
          </p>

          {/* Subtle CTA */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/50 transition-all duration-200 hover:bg-white/[0.08] hover:text-white/70 hover:border-white/[0.15]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
            </svg>
            Sign in
          </Link>
        </div>
      )}

      {/* Empty state - Logged in but no history (professional, encouraging) */}
      {!loading && !hasItems && isAuthenticated && (
        <div className="text-center py-12 px-4">
          {/* Icon */}
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>

          <p className="text-sm text-white/50 mb-1">
            Belum ada history
          </p>
          <p className="text-sm text-white/30">
            Mulai percakapan pertama kamu
          </p>
        </div>
      )}

      {/* History list */}
      {hasItems && (
        <div className={`space-y-3 ${loading ? "opacity-60" : ""}`}>
          {items.map((it, index) => (
            <article
              key={it.id}
              className="bg-[#141414] rounded-[14px] border border-white/[0.06] p-4 transition-all duration-300 hover:border-white/[0.12] animate-fade-in"
              style={{ animationDelay: `${index * 50}ms`, opacity: 0, animationFillMode: "forwards" }}
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/40">{formatDate(it.created_at)}</span>
                </div>
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.10] flex items-center justify-center text-white/60 transition-all duration-150 hover:bg-white/[0.10] hover:text-white disabled:opacity-30"
                  onClick={() => copyToClipboard(it.result)}
                  title="Copy result"
                  aria-label="Copy result"
                  disabled={loading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>

              {/* Input context */}
              {it.context && (
                <div className="text-sm text-white/50 italic mb-2">Q: "{truncateContext(it.context)}"</div>
              )}

              {/* Result */}
              <div className="text-base text-white/95 leading-relaxed">{it.result}</div>
            </article>
          ))}
        </div>
      )}

      {/* Load more */}
      {canLoadMore && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-transparent border border-white/[0.10] text-sm text-white/60 transition-all duration-200 hover:bg-white/[0.06] hover:text-white/80 hover:border-white/[0.20] disabled:opacity-40"
            onClick={onLoadMore}
            disabled={loading || loadingMore}
          >
            {loadingMore ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                {t("loading")}
              </>
            ) : (
              t("loadMore")
            )}
          </button>
        </div>
      )}
    </section>
  );
}

