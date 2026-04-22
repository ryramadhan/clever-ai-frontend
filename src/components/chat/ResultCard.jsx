import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import FeedbackModal from "../modals/FeedbackModal.jsx";

export default function ResultCard({ text, isTyping, provider, hasResult, onRegenerate }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [likeState, setLikeState] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

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

  function handleLike() {
    if (likeState === 'like') {
      setLikeState(null);
    } else {
      setLikeState('like');

      setFeedbackSubmitted(true);
      setTimeout(() => setFeedbackSubmitted(false), 3000);
    }
  }

  function handleDislike() {
    if (likeState === 'dislike') {
      setLikeState(null);
    } else {
      setLikeState('dislike');
      setShowFeedbackModal(true);
    }
  }

  function handleFeedbackClose() {
    setShowFeedbackModal(false);
    setLikeState(null);
  }

  function handleFeedbackSubmit(data) {
    // Here you can send feedback to backend
    console.log({
      type: 'dislike',
      reason: data.reason,
      detail: data.detail,
      text: text?.slice(0, 100)
    });

    setFeedbackSubmitted(true);
    setTimeout(() => setFeedbackSubmitted(false), 3000);
  }

  if (!hasResult) return null;

  return (
    <section className="w-full" aria-live="polite">
      <div className="py-6">
        <div className="text-white/80 text-[15px] font-normal leading-relaxed whitespace-pre-wrap break-words">
          {text}
          {isTyping && (
            <span
              className="inline-block w-[2px] h-[1.2em] bg-white/80 ml-1 align-middle animate-pulse"
              aria-hidden="true"
            />
          )}
        </div>

        {!isTyping && (
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLike}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200"
                title="Membantu"
                aria-label="Membantu"
              >
                {likeState === 'like' ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white/40 hover:text-white/70">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                onClick={handleDislike}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200"
                title="Tidak membantu"
                aria-label="Tidak membantu"
              >
                {likeState === 'dislike' ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white/40 hover:text-white/70">
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white/90 hover:bg-white/[0.06] transition-all duration-200"
                title="Salin"
              >
                {copied ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Tersalin
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Salin
                  </>
                )}
              </button>

              {provider && (
                <span className="ml-auto text-[10px] text-white/30 uppercase tracking-wider">
                  {provider === "gemini" ? "Gemini" : "AI"}
                </span>
              )}
            </div>

            {feedbackSubmitted && (
              <div className="mt-3 flex items-center gap-2 text-sm text-white/70 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white/60">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Terima kasih atas masukan Anda
              </div>
            )}
          </div>
        )}
      </div>

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={handleFeedbackClose}
        onSubmit={handleFeedbackSubmit}
      />
    </section>
  );
}

