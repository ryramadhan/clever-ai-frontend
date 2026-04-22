import { createPortal } from "react-dom";

export default function LogoutConfirmModal({ isOpen, onConfirm, onCancel, t }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onCancel}
      />
      <div
        className="relative w-full max-w-sm bg-[#1a1a1a] rounded-xl border border-white/[0.08] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-white mb-2">
          {t("signOutTitle")}
        </h3>
        <p className="text-sm text-white/60 mb-6 leading-relaxed">
          {t("signOutMessage")}
        </p>
        <div className="flex flex-col-reverse gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-white/60 transition-all duration-200 hover:text-white/90 hover:bg-white/[0.04]"
          >
            {t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-black bg-white hover:bg-white/90 transition-all duration-200"
          >
            {t("signOut")}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
