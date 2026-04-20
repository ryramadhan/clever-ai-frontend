import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Sidebar from "../components/sidebar/Sidebar.jsx";
import ResultCard from "../components/ResultCard.jsx";
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
  const { isAuthenticated, user } = useAuth();
  const [context, setContext] = useState("");
  const [userMessage, setUserMessage] = useState("");
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
  const [retryCount, setRetryCount] = useState(0);
  const timeoutRef = useRef(null);
  const [historyLoadingMore, setHistoryLoadingMore] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const textareaRef = useRef(null);

  const typed = useTypingText(result, { enabled: enableTyping });
  const isTyping = enableTyping && typed !== result;
  const HISTORY_LIMIT = 20;

  const canSubmit = useMemo(() => {
    return Boolean(context.trim()) && !loading;
  }, [context, loading]);

  async function refreshHistory(useCache = true) {
    setHistoryError("");
    setHistoryLoading(true);
    try {
      const data = await getCaptions({ limit: HISTORY_LIMIT, offset: 0, useCache });
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
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onGenerate(e) {
    if (e?.preventDefault) e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);
    setResult("");
    setProvider("");
    setUserMessage(context.trim());

    const attempt = retryCount;
    const maxRetries = 3;
    const delay = Math.min(1000 * Math.pow(2, attempt), 8000);

    if (attempt > 0) {
      await new Promise(r => setTimeout(r, delay));
    }

    const timeoutId = setTimeout(() => {
      setError(t("takingLonger") || "Taking longer than usual...");
    }, 30000);
    timeoutRef.current = timeoutId;

    try {
      const data = await generateResponse({ context: context.trim() });
      clearTimeout(timeoutId);
      setResult(data.result || "");
      setProvider(data.provider || "");
      setContext("");
      setRetryCount(0);
      await refreshHistory();
    } catch (err) {
      clearTimeout(timeoutId);
      const status = err?.status || err?.statusCode;
      // Network errors (no status) are retryable
      const isRetryable = !status || (status !== 429 && status !== 401 && status !== 403 && status < 500);
      if (attempt < maxRetries && isRetryable) {
        setRetryCount(attempt + 1);
        setError(`${t("retrying") || "Retrying"} (${attempt + 1}/${maxRetries})...`);
        setTimeout(() => onGenerate(), 100);
      } else {
        setRetryCount(0);
        setError(err?.message || t("somethingWrong") || "Something went wrong");
      }
    } finally {
      if (attempt >= maxRetries || !error?.includes("Retrying")) {
        setLoading(false);
      }
    }
  }

  async function handleNewChat() {
    await refreshHistory();
    setContext("");
    setUserMessage("");
    setResult("");
    setProvider("");
    setError("");
    setEnableTyping(true);
    setTimeout(() => textareaRef.current?.focus({ preventScroll: true }), 0);
  }

  function handleHistoryItemClick(item) {
    setContext("");
    setUserMessage(item.context || "");
    setResult(item.result || "");
    setProvider("");
    setError("");
  }

  function handleHistoryItemsChange(newItems) {
    setHistory(newItems);
  }

  function toggleSidebar() {
    setIsSidebarOpen((prev) => !prev);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="h-screen flex bg-[#0a0a0a] overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        onClose={closeSidebar}
        historyItems={history}
        historyLoading={historyLoading}
        onRefreshHistory={refreshHistory}
        onHistoryItemClick={handleHistoryItemClick}
        onNewChat={handleNewChat}
        onHistoryItemsChange={handleHistoryItemsChange}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={toggleSidebar} />

        <main className="flex-1 overflow-hidden flex flex-col">
          {!result ? (
            <div className="flex-1 overflow-y-auto">
              <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 min-h-full flex flex-col">
                {/* Hero */}
                <section className="mb-12 flex-1 flex flex-col justify-center px-4">
                  <div className="space-y-2">
                    <p className="text-base text-white/60 font-normal">
                      {isAuthenticated && user?.name
                        ? `${t("heroGreeting")} ${user.name.split(' ')[0]}`
                        : t("heroGuestGreeting")}
                    </p>
                    <h1 className="text-3xl sm:text-[2rem] font-normal text-white/95">
                      {isAuthenticated
                        ? t("heroQuestion")
                        : t("heroGuestQuestion")}
                    </h1>
                  </div>
                </section>

                {/* Input */}
                <div className="w-full">
                  <div className="relative bg-[#141414] rounded-2xl sm:rounded-[26px] border border-white/[0.08] shadow-lg shadow-black/20 min-h-[52px] sm:min-h-[56px] flex items-center pr-12 sm:pr-14">
                    <textarea
                      ref={textareaRef}
                      className="w-full py-3 sm:py-[15px] px-4 sm:px-5 bg-transparent text-white/95 text-[15px] sm:text-base placeholder:text-white/40 resize-none transition-all duration-200 focus:outline-none disabled:opacity-50 leading-normal"
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder={t("contextPlaceholder")}
                      disabled={loading}
                      rows={1}
                      maxLength={2000}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && canSubmit) {
                          e.preventDefault();
                          onGenerate();
                        }
                      }}
                      onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                      }}
                    />
                    {/* Send Button */}
                    <button
                      type="button"
                      onClick={onGenerate}
                      disabled={!canSubmit || loading}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-[#0a0a0a] flex items-center justify-center transition-all duration-200 hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-white/50"
                      aria-label={t("generate")}
                    >
                      {loading ? (
                        <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
                      ) : (
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-white/25 text-center mt-3">
                    {t("pressEnterToSend")}
                  </p>

                  {/* Error */}
                  {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                      <span className="text-red-400 text-sm">{error}</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <footer className="py-8 text-center">
                  <span className="text-xs text-white/30">
                    © {new Date().getFullYear()} Clever AI
                  </span>
                </footer>
              </div>
            </div>
          ) : (
            <>
              {/* Chat History - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-white/[0.03] rounded-2xl px-5 py-3">
                      <p className="text-white/80 text-[15px] font-normal leading-relaxed break-words">{userMessage}</p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <ResultCard
                      text={typed}
                      isTyping={isTyping}
                      provider={provider}
                      hasResult={Boolean(result)}
                      onRegenerate={onGenerate}
                    />
                  </div>

                  {/* Guest CTA */}
                  {!isAuthenticated && !isTyping && (
                    <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/[0.12]">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex-1 text-center sm:text-left">
                          <p className="text-sm font-medium text-white/90 mb-1">
                            {t("likeWhatYouSee")}
                          </p>
                          <p className="text-xs text-white/50">
                            {t("signInToSaveAndHistory")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-all duration-200"
                          >
                            {t("signIn")}
                          </Link>
                          <Link
                            to="/register"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-sm text-white/80 hover:bg-white/[0.10] hover:text-white transition-all duration-200"
                          >
                            {t("createAccount")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input - Sticky Bottom */}
              <div className="bg-[#0a0a0a]">
                <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                  <div className="relative bg-[#141414] rounded-[26px] border border-white/[0.08] shadow-lg shadow-black/20 min-h-[56px] flex items-center">
                    <textarea
                      ref={textareaRef}
                      className="w-full py-[15px] px-5 pr-14 bg-transparent text-white/95 text-base placeholder:text-white/40 resize-none transition-all duration-200 focus:outline-none disabled:opacity-50 leading-normal"
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder={t("askFollowUp")}
                      disabled={loading}
                      rows={1}
                      maxLength={2000}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && canSubmit) {
                          e.preventDefault();
                          onGenerate();
                        }
                      }}
                      onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                      }}
                    />
                    <button
                      type="button"
                      onClick={onGenerate}
                      disabled={!canSubmit || loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-[#0a0a0a] flex items-center justify-center transition-all duration-200 hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-white/50"
                      aria-label={t("generate")}
                    >
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-white/20 text-center mt-1 sm:mt-2">
                    {t("aiMayProduceInaccurate")}
                  </p>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}