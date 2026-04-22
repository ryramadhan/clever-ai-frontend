import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Sparkles, CheckCircle, ChevronRight } from "lucide-react";
import Header from "../components/layout/Header.jsx";
import Sidebar from "../components/sidebar/Sidebar.jsx";
import ResultCard from "../components/chat/ResultCard.jsx";
import Footer from "../components/layout/Footer.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { generateResponseStream, getCaptions } from "../services/api.js";

export default function HomePage() {
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [context, setContext] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [provider, setProvider] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [historyOffset, setHistoryOffset] = useState(0);
  const [historyHasMore, setHistoryHasMore] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const timeoutRef = useRef(null);
  const [historyLoadingMore, setHistoryLoadingMore] = useState(false);

  const navigate = useNavigate();

  function scrollToBottom(behavior = "smooth") {
    scrollAnchorRef.current?.scrollIntoView({ behavior, block: "end" });
  }

  useEffect(() => {
    if (result && isStreaming) {
      scrollToBottom("smooth");
    }
  }, [result, isStreaming]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const textareaRef = useRef(null);
  const abortControllerRef = useRef(null);
  const chatContainerRef = useRef(null);
  const scrollAnchorRef = useRef(null);

  const isTyping = isStreaming;
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
    if (loading || isStreaming) return;

    // Cancel any existing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setError("");
    setLoading(true);
    setIsStreaming(true);
    setResult("");
    setProvider("");
    setUserMessage(context.trim());

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

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
      let fullResult = "";
      let finalProvider = "";

      for await (const data of generateResponseStream({
        context: context.trim(),
        signal: abortController.signal,
      })) {
        if (data.error) {
          throw new Error(data.message || "Stream error");
        }

        if (data.chunk) {
          fullResult += data.chunk;
          setResult(fullResult);
          if (data.provider) finalProvider = data.provider;
        }

        if (data.done) {
          fullResult = data.result || fullResult;
          finalProvider = data.provider || finalProvider;
          setResult(fullResult);
          setProvider(finalProvider);
          break;
        }
      }

      clearTimeout(timeoutId);
      setContext("");
      setRetryCount(0);
      await refreshHistory();
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        // User cancelled, don't show error
        return;
      }

      const status = err?.status || err?.statusCode;
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
      setIsStreaming(false);
      setLoading(false);
      abortControllerRef.current = null;
    }
  }

  async function handleNewChat() {
    // Cancel any ongoing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    await refreshHistory();
    setContext("");
    setUserMessage("");
    setResult("");
    setProvider("");
    setError("");
    setIsStreaming(false);
    setLoading(false);

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
      setTimeout(() => textareaRef.current?.focus({ preventScroll: true }), 0);
    }
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

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scrollToChat() {
    scrollToTop();
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }

  return (
    <div className="h-screen flex bg-[#0a0a0a] overflow-hidden">
      {/* Noise texture layer — subtle, non-interactive */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />
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

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Header onMenuToggle={toggleSidebar} />

        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto thin-scrollbar">
          {!result ? (
            <div className="flex-1 relative">
              {/* Animated Background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.03)_0%,transparent_50%)] animate-pulse-slow" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.02)_0%,transparent_50%)] animate-pulse-slow-reverse" />
              </div>

              <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 min-h-full flex flex-col relative z-10">
                {/* Hero */}
                <section className="mb-10 flex-1 flex flex-col justify-center px-4">
                  <div className="space-y-3">
                    {/* Greeting — kecil, muted */}
                    <p className="text-sm text-white/60 font-normal tracking-wide">
                      {isAuthenticated && user?.name
                        ? `${t("heroGreeting")} ${user.name.split(' ')[0]}`
                        : t("heroGuestGreeting")}
                    </p>

                    {/* Headline — besar, kontras */}
                    <h1 className="text-3xl sm:text-4xl font-semibold text-white leading-tight">
                      {isAuthenticated ? t("heroQuestion") : t("heroGuestQuestion")}
                    </h1>

                    {/* Tagline brand — signature Clever AI */}
                    <p className="text-sm text-white/50 font-normal">
                      Powered by AI · Bahasa Indonesia & English
                    </p>
                  </div>
                </section>

                {/* Stats Block — Social Proof */}
                <section className="mb-10 px-4">
                  <div className="w-full max-w-md mx-auto">
                    {/* Divider atas */}
                    <div className="w-full h-px bg-white/[0.06] mb-6" />

                    {/* 3 stat items dalam satu row */}
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: "1.2K+", label: "Hasil dibuat" },
                        { value: "< 3s",  label: "Waktu generate" },
                        { value: "2",     label: "Bahasa didukung" },
                      ].map((stat, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <span className="text-xl sm:text-2xl font-semibold text-white/90 tabular-nums">
                            {stat.value}
                          </span>
                          <span className="text-[11px] text-white/60 leading-tight">
                            {stat.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Divider bawah */}
                    <div className="w-full h-px bg-white/[0.06] mt-6" />
                  </div>
                </section>

                {/* Quick Suggestions */}
                <section className="mb-8 px-4">
                  <p className="text-[11px] text-white/45 text-center mb-3 tracking-wider uppercase">
                    Coba tanyakan
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      { icon: "💪", text: "Tips motivasi" },
                      { icon: "💻", text: "Belajar coding" },
                      { icon: "🏃", text: "Jaga kesehatan" },
                      { icon: "💼", text: "Produktivitas kerja" },
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setContext(suggestion.text);
                          setTimeout(() => textareaRef.current?.focus(), 0);
                        }}
                        className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 hover:bg-white/[0.08] hover:border-white/[0.15] hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-white/5 transition-all duration-300 ease-out"
                      >
                        <span className="group-hover:scale-110 transition-transform duration-300">{suggestion.icon}</span>
                        <span>{suggestion.text}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Scroll Hint */}
                <div className="flex items-center justify-center gap-2 mb-6 text-white/40">
                  <div className="w-8 h-px bg-white/20" />
                  <span className="text-xs">Scroll for footer</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  <div className="w-8 h-px bg-white/20" />
                </div>

                {/* Input */}
                <div className="w-full">
                  <div className="relative bg-[#141414] rounded-2xl sm:rounded-[26px] border border-white/[0.08] shadow-lg shadow-black/20 min-h-[52px] sm:min-h-[56px] flex items-center pr-12 sm:pr-14">
                    <textarea
                      ref={textareaRef}
                      className="w-full py-3 sm:py-[15px] px-4 sm:px-5 bg-transparent text-white text-[15px] sm:text-base placeholder:text-white/50 resize-none transition-all duration-200 focus:outline-none disabled:opacity-50 leading-normal"
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
                  <p className="text-[10px] text-white/45 text-center mt-3">
                    {t("brandTagline")}
                  </p>

                  {/* Error */}
                  {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                      <span className="text-red-400 text-sm">{error}</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <Footer
                  onChatClick={scrollToChat}
                  onHistoryClick={toggleSidebar}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Chat History */}
              <div ref={chatContainerRef} className="flex-1 min-h-0 overflow-y-auto thin-scrollbar">
                <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-32 space-y-6">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-white/[0.03] rounded-2xl px-5 py-3">
                      <p className="text-white text-[15px] font-normal leading-relaxed break-words">{userMessage}</p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <ResultCard
                      text={result}
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

                  {/* Scroll anchor sentinel */}
                  <div ref={scrollAnchorRef} className="h-1" />
                </div>
              </div>

              {/* Input - Bottom */}
              <div className="shrink-0 bg-[#0a0a0a] w-full px-4 sm:px-6">
                <div className="w-full max-w-3xl mx-auto">
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
                  <p className="text-[10px] text-white/45 text-center mt-1 sm:mt-2 pb-3 sm:pb-4">
                    {t("aiMayProduceInaccurate")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}