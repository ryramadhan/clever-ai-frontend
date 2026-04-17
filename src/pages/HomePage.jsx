import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import ResultCard from "../components/ResultCard.jsx";
import HistoryList from "../components/HistoryList.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { generateResponse, getCaptions } from "../services/api.js";

function useTypingText(fullText, { enabled, speedMs = 16 } = {}) {
  const [typed, setTyped] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setTyped(fullText || "");
      return;
    }

    const target = fullText || "";
    setTyped("");
    let i = 0;

    function tick() {
      i += 1;
      setTyped(target.slice(0, i));
      if (i >= target.length) return;
      timerRef.current = window.setTimeout(tick, speedMs);
    }

    timerRef.current = window.setTimeout(tick, speedMs);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [fullText, enabled, speedMs]);

  return typed;
}

export default function HomePage() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [provider, setProvider] = useState("");
  const [enableTyping, setEnableTyping] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [historyOffset, setHistoryOffset] = useState(0);
  const [historyHasMore, setHistoryHasMore] = useState(true);
  const [historyLoadingMore, setHistoryLoadingMore] = useState(false);

  const typed = useTypingText(result, { enabled: enableTyping });
  const isTyping = enableTyping && typed !== result;
  const HISTORY_LIMIT = 20;

  const canSubmit = useMemo(() => {
    return Boolean(context.trim()) && !loading;
  }, [context, loading]);

  async function refreshHistory() {
    setHistoryError("");
    setHistoryLoading(true);
    try {
      const data = await getCaptions({ limit: HISTORY_LIMIT, offset: 0 });
      const items = Array.isArray(data.items) ? data.items : [];
      setHistory(items);
      setHistoryOffset(items.length);
      setHistoryHasMore(items.length >= HISTORY_LIMIT);
    } catch (err) {
      setHistoryError(err?.message || "Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  }

  async function loadMoreHistory() {
    if (historyLoading || historyLoadingMore || !historyHasMore) return;
    setHistoryError("");
    setHistoryLoadingMore(true);
    try {
      const data = await getCaptions({
        limit: HISTORY_LIMIT,
        offset: historyOffset,
      });
      const nextItems = Array.isArray(data.items) ? data.items : [];

      const seen = new Set(history.map((h) => h.id));
      const merged = [...history];
      for (const it of nextItems) {
        if (!seen.has(it.id)) merged.push(it);
      }

      setHistory(merged);
      setHistoryOffset(merged.length);
      setHistoryHasMore(nextItems.length >= HISTORY_LIMIT);
    } catch (err) {
      setHistoryError(err?.message || "Failed to load more history");
    } finally {
      setHistoryLoadingMore(false);
    }
  }

  useEffect(() => {
    refreshHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onGenerate(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult("");
    setProvider("");

    try {
      const data = await generateResponse({ context: context.trim() });
      setResult(data.result || "");
      setProvider(data.provider || "");
      refreshHistory();
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Hero */}
        <section className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white/95 mb-2">
            {t("heroTitle")}
          </h1>
          <p className="text-base text-white/60">
            {t("heroSubtitle")}
          </p>
        </section>

        {/* Generator */}
        <div className="flex flex-col gap-6">
          {/* Input Section */}
          <section className="w-full space-y-6">
            {/* Context Input */}
            <div className="space-y-3">
              <span className="block text-xs font-medium tracking-wider text-white/60 uppercase">{t("contextLabel")}</span>
              <div className="relative">
                <textarea
                  className="w-full min-h-[160px] p-4 rounded-[14px] bg-[#141414] border border-white/[0.06] text-white/95 text-base placeholder:text-white/30 resize-y transition-all duration-200 focus:outline-none focus:border-white/[0.20] focus:bg-[#1a1a1a] disabled:opacity-50"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder={t("contextPlaceholder")}
                  disabled={loading}
                  rows={5}
                  maxLength={2000}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="block text-sm text-white/40">
                    {t("contextHint")}
                  </span>
                </div>
                <span className={`block text-xs ${context.length >= 1800 ? "text-amber-400" : "text-white/30"}`}>
                  {context.length}/2000
                </span>
              </div>
            </div>

            {/* Generate Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[10px] bg-white text-[#0a0a0a] font-medium text-sm transition-all duration-200 hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
                onClick={onGenerate}
                disabled={!canSubmit}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin-slow" />
                    {t("generating")}
                  </>
                ) : (
                  t("generate")
                )}
              </button>

              <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/[0.20] bg-transparent checked:bg-white checked:border-white focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  checked={enableTyping}
                  onChange={(e) => setEnableTyping(e.target.checked)}
                  disabled={loading}
                />
                <span>{t("typewriterEffect")}</span>
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-[10px] bg-red-500/10 border border-red-500/20">
                <span className="text-red-400 text-sm">{error}</span>
                <button
                  type="button"
                  onClick={onGenerate}
                  disabled={loading}
                  className="text-sm text-white/60 hover:text-white underline underline-offset-2 disabled:opacity-40 disabled:no-underline transition-colors"
                >
                  Try again
                </button>
              </div>
            )}
          </section>

          {/* Result Card */}
          <ResultCard
            text={typed}
            isTyping={isTyping}
            provider={provider}
            hasResult={Boolean(result)}
          />

          {/* Guest CTA - Show after result */}
          {!isAuthenticated && result && !isTyping && (
            <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-sm text-white/50 text-center sm:text-left">
                  {t("savePrompt")}
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.10] text-sm text-white/70 hover:bg-white/[0.10] hover:text-white hover:border-white/[0.15] transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  {t("signInToSave")}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* History */}
        <HistoryList
          items={history}
          loading={historyLoading}
          error={historyError}
          onRefresh={refreshHistory}
          onLoadMore={loadMoreHistory}
          canLoadMore={historyHasMore}
          loadingMore={historyLoadingMore}
          isAuthenticated={isAuthenticated}
        />
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-white/[0.06] mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm text-white/40">
            © {new Date().getFullYear()} AI Assistant
          </span>
        </div>
      </footer>
    </div>
  );
}

