import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { pinCaption, deleteCaption } from "../../services/api.js";
import DeleteConfirmModal from "../modals/DeleteConfirmModal.jsx";

export default function HistoryItemMenu({
  item,
  onStartRename,
  onPin,
  onDelete,
  t,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0 });
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e) {
      if (!buttonRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleMenuClick = useCallback((e) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({ top: rect.top + rect.height / 2 });
    }
    setIsOpen((prev) => !prev);
  }, [isOpen]);

  const handleRenameClick = useCallback((e) => {
    e.stopPropagation();
    setIsOpen(false);
    onStartRename?.();
  }, [onStartRename]);

  const handlePin = useCallback(async (e) => {
    e.stopPropagation();

    const newPinState = !item.is_pinned;
    setIsOpen(false);
    onPin(item.id, newPinState);

    try {
      await pinCaption(item.id, newPinState);
    } catch (err) {
      console.error("Failed to pin:", err);
      onPin(item.id, !newPinState);
    }
  }, [item.id, item.is_pinned, onPin]);

  const handleDeleteClick = useCallback((e) => {
    e.stopPropagation();
    setIsOpen(false);
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    setShowDeleteConfirm(false);
    onDelete(item.id);

    try {
      await deleteCaption(item.id);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  }, [item.id, onDelete]);

  const menuContent = isOpen && (
    <div
      className="fixed inset-0 z-[9998] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="absolute left-[160px] top-[var(--menu-top)] -translate-y-1/2 w-[160px] bg-[#141414] border border-white/[0.06] rounded-md shadow-xl py-1"
        style={{ "--menu-top": `${menuPosition.top}px` }}
        onClick={(e) => e.stopPropagation()}
        role="menu"
      >
        <button
          type="button"
          onClick={handleRenameClick}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/[0.06] rounded-md transition-colors"
          role="menuitem"
        >
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          <span>{t("renameChat")}</span>
        </button>

        <button
          type="button"
          onClick={handlePin}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/[0.06] rounded-md transition-colors"
          role="menuitem"
        >
          {item.is_pinned ? (
            <>
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <span>{t("unpinChat")}</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 019.186 0z" />
              </svg>
              <span>{t("pinChat")}</span>
            </>
          )}
        </button>

        <div className="my-1 border-t border-white/[0.06]" />

        <button
          type="button"
          onClick={handleDeleteClick}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/[0.06] rounded-md transition-colors"
          role="menuitem"
        >
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.562 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          <span>{t("deleteChat")}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleMenuClick}
        className={`
          flex items-center justify-center rounded-md
          transition-all duration-150 ease-out
          ${isOpen ? "bg-white/15 text-white/90" : "text-white/40 hover:text-white/70 hover:bg-white/8"}
        `}
        style={{ width: "28px", height: "28px" }}
        aria-label={t("menu")}
        aria-expanded={isOpen}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="6" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="18" r="1.5" />
        </svg>
      </button>

      {menuContent && createPortal(menuContent, document.body)}

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        t={t}
      />
    </>
  );
}
