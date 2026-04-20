export default function LogoutConfirmModal({ isOpen, onConfirm, onCancel, t, zIndex = "z-[100]" }) {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 ${zIndex}`}>
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onCancel}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="w-full max-w-xs bg-[#141414] rounded-xl border border-white/[0.08] p-5 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-base font-semibold text-white/95 mb-2">
            {t("signOutTitle")}
          </h3>
          <p className="text-sm text-white/50 mb-5 leading-relaxed">
            {t("signOutMessage")}
          </p>
          <div className="flex flex-col-reverse gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white/50 transition-all duration-200 hover:text-white/70"
            >
              {t("cancel")}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg text-sm font-medium text-black bg-white hover:bg-white/90 transition-all duration-200"
            >
              {t("signOut")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
