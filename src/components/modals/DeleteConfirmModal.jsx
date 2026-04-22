import { useCallback } from "react";
import { createPortal } from "react-dom";

export default function DeleteConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
  t,
}) {
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  }, [onCancel]);

  const handleCancel = useCallback((e) => {
    e.stopPropagation();
    onCancel();
  }, [onCancel]);

  const handleConfirm = useCallback((e) => {
    e.stopPropagation();
    onConfirm();
  }, [onConfirm]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-title"
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative w-full max-w-sm bg-[#141414] rounded-xl border border-white/[0.08] p-6 shadow-2xl">
        <h3 id="delete-title" className="text-base font-semibold text-white mb-2">
          {t("confirmDeleteTitle")}
        </h3>

        <p className="text-sm text-white/60 mb-6 leading-relaxed">
          {t("confirmDeleteMessage")}
        </p>

        <div className="flex flex-col-reverse gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-white/60 transition-all duration-200 hover:text-white/90"
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-black bg-white hover:bg-white/90 transition-all duration-200"
          >
            {t("deleteChat")}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
