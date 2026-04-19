import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function ResultCard({ text, isTyping, provider, hasResult, onRegenerate }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  if (!hasResult) return null;

  return (
    <section className="w-full" aria-live="polite">
      {/* Response) */}
      <div className="py-6">
        {/* Content with typing animation */}
        <div className="text-white/95 text-lg leading-[1.75] whitespace-pre-wrap">
          {text}
          {isTyping && (
            <span
              className="inline-block w-[2px] h-[1.2em] bg-white/80 ml-1 align-middle animate-pulse"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Action buttons - minimal style */}
        {!isTyping && (
          <div className="flex items-center gap-2 mt-6">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white/90 hover:bg-white/[0.06] transition-all duration-200"
              title={t("copy")}
            >
              {copied ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {t("copied")}
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  {t("copy")}
                </>
              )}
            </button>

            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white/90 hover:bg-white/[0.06] transition-all duration-200"
                title={t("regenerate")}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t("regenerate")}
              </button>
            )}

            {/* Provider badge - minimal */}
            {provider && (
              <span className="ml-auto text-[10px] text-white/30 uppercase tracking-wider">
                {provider === "gemini" ? "Gemini" : "AI"}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

