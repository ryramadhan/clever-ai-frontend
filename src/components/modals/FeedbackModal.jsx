import { useState } from "react";
import { createPortal } from "react-dom";

const FEEDBACK_REASONS = [
  { value: "not_accurate", label: "Tidak benar atau tidak lengkap" },
  { value: "not_what_i_wanted", label: "Bukan yang saya minta" },
  { value: "harmful", label: "Berbahaya atau tidak aman" },
  { value: "other", label: "Lainnya" }
];

export default function FeedbackModal({ isOpen, onClose, onSubmit }) {
  const [selectedReason, setSelectedReason] = useState("");
  const [feedbackDetail, setFeedbackDetail] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const selectedLabel = FEEDBACK_REASONS.find(r => r.value === selectedReason)?.label || "Pilih jenis masalah";

  function handleCancel() {
    setIsDropdownOpen(false);
    onClose();
    setTimeout(() => {
      setSelectedReason("");
      setFeedbackDetail("");
      setIsDropdownOpen(false);
    }, 200);
  }

  function handleSubmit() {
    if (!selectedReason) return;

    onSubmit({
      reason: selectedReason,
      detail: feedbackDetail
    });

    onClose();
    setSelectedReason("");
    setFeedbackDetail("");
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && handleCancel()}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative w-full max-w-md bg-[#1a1a1a] rounded-2xl border border-white/[0.06] shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h3 className="text-lg font-semibold text-white mb-1">
            Berikan umpan balik negatif
          </h3>
          <p className="text-sm text-white/50">
            Jenis masalah apa yang ingin Anda laporkan?
          </p>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <div className="relative">
            {/* Trigger button */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/[0.08] text-sm text-left transition-all duration-200 hover:border-white/20 focus:outline-none focus:border-white/20"
            >
              <span className={selectedReason ? "text-white/90" : "text-white/40"}>
                {selectedLabel}
              </span>
              <svg
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-[#1a1a1a] border border-white/[0.08] shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                {FEEDBACK_REASONS.map((reason) => (
                  <button
                    key={reason.value}
                    type="button"
                    onClick={() => {
                      setSelectedReason(reason.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm transition-all duration-150 ${selectedReason === reason.value
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/[0.06] hover:text-white/90'
                      }`}
                  >
                    {reason.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail textarea */}
          <div>
            <label className="block text-sm text-white/60 mb-2">
              Berikan detail (opsional)
            </label>
            <textarea
              value={feedbackDetail}
              onChange={(e) => setFeedbackDetail(e.target.value)}
              placeholder="Apa yang kurang memuaskan dari respons ini?"
              className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/[0.08] text-sm text-white/90 placeholder:text-white/30 resize-none focus:outline-none focus:border-white/20 transition-colors"
              rows={3}
            />
          </div>

          {/* Info text */}
          <p className="text-xs text-white/40 leading-relaxed">
            Mengirimkan laporan ini akan mengirim seluruh percakapan untuk membantu meningkatkan model AI.
          </p>
        </div>

        {/* Footer buttons */}
        <div className="px-6 py-4 bg-[#0f0f0f] border-t border-white/[0.06] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            Batalkan
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedReason}
            className="px-5 py-2 rounded-lg text-sm font-medium text-black bg-white hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
