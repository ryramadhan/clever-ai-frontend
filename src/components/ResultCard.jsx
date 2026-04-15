import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function ResultCard({ text, isTyping, provider, hasResult }) {
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

  return (
    <section className="w-full" aria-live="polite">
      <div className="bg-[#141414] rounded-[14px] border border-white/[0.06] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
          <span className="text-xs font-medium tracking-wider text-white/60 uppercase">AI Response</span>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.10] flex items-center justify-center text-white/60 transition-all duration-150 hover:bg-white/[0.10] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={handleCopy}
            disabled={!text}
            title="Copy to clipboard"
            aria-label="Copy result"
          >
            {copied ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 min-h-[120px]">
          {hasResult ? (
            <p className="text-white/95 text-lg leading-relaxed whitespace-pre-wrap">
              {text}
              {isTyping && <span className="inline-block w-0.5 h-5 bg-white/80 ml-0.5 align-middle caret-blink" aria-hidden="true" />}
            </p>
          ) : (
            <p className="text-white/40 text-base italic">
              {t("resultPlaceholder")}
            </p>
          )}
        </div>

        {/* Meta */}
        {hasResult && (
          <div className="px-4 py-2.5 border-t border-white/[0.06] flex items-center justify-end">
            {provider && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.10] text-xs text-white/60">
                {provider === "gemini" ? t("aiGenerated") : t("mock")}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

