import { useState, useEffect } from "react";
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
}) {
  const { t } = useLanguage();
  const showLoading = useDelayedLoading(loading, 200);
  const hasItems = items && items.length > 0;

  return (
    <section className="w-full max-w-2xl mx-auto mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold tracking-tight text-white/95">{t("historyTitle")}</h2>
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

      {/* Empty state */}
      {!loading && !hasItems && (
        <div className="text-center py-12 text-base text-white/40">
          {t("noHistory")}
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

