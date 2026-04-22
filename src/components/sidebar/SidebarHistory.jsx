import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import HistoryItemMenu from "./HistoryItemMenu.jsx";
import { renameCaption } from "../../services/api.js";

function truncateText(text, maxLength = 45) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

function formatDateShort(iso) {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function HistoryItem({ item, onClick, onRename, onPin, onDelete, t }) {
  const [mode, setMode] = useState("view");
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const inputRef = useRef(null);
  const savedRef = useRef(false);

  useEffect(() => {
    if (mode === "edit" && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [mode]);

  const startEdit = useCallback(() => {
    setValue(item.title || truncateText(item.context, 50) || t("untitledChat"));
    setMode("edit");
    savedRef.current = false;
  }, [item, t]);

  const save = useCallback(async () => {
    if (savedRef.current || pending) return;
    savedRef.current = true;

    const trimmed = value.trim();
    const original = item.title || "";

    if (!trimmed || trimmed === original) {
      setMode("view");
      return;
    }

    setPending(true);
    try {
      await renameCaption(item.id, trimmed);
      onRename(item.id, trimmed);
      setMode("view");
    } catch {
      setMode("view");
    } finally {
      setPending(false);
    }
  }, [value, item.id, item.title, onRename, pending]);

  const cancel = useCallback(() => {
    if (pending) return;
    setMode("view");
  }, [pending]);

  const handleKey = useCallback((e) => {
    if (e.key === "Enter") save();
    else if (e.key === "Escape") cancel();
  }, [save, cancel]);

  const handleBlur = useCallback(() => {
    setTimeout(save, 50);
  }, [save]);

  if (mode === "edit") {
    return (
      <div className="px-2 py-2">
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2.5 border bg-white/[0.08] border-white/[0.15] ${pending ? "opacity-60" : "focus-within:border-white/30"}`}>
          {item.is_pinned && (
            <svg className="w-3.5 h-3.5 text-white/40 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          )}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
            onBlur={handleBlur}
            maxLength={255}
            disabled={pending}
            className="flex-1 min-w-0 bg-transparent text-sm text-white/90 placeholder:text-white/30 focus:outline-none"
            placeholder={t("untitledChat")}
          />
          {pending && <span className="w-4 h-4 border-2 border-white/30 border-t-white/80 rounded-full animate-spin flex-shrink-0" />}
        </div>
        <p className="text-[10px] text-white/30 mt-1 px-1">{t("renameHint")}</p>
      </div>
    );
  }

  return (
    <div className="group/item relative">
      <button
        onClick={() => onClick(item)}
        className="w-full text-left px-3 py-3 rounded-lg hover:bg-white/[0.06] active:bg-white/[0.08] transition-all duration-200"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0 pr-8">
            <p className="text-sm text-white/80 group-hover/item:text-white/95 transition-colors flex items-center gap-1.5">
              {item.is_pinned && (
                <svg className="w-3.5 h-3.5 text-white/50 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              )}
              <span className="truncate">{truncateText(item.title || item.context || t("untitledChat"), 50)}</span>
            </p>
            <p className="text-xs text-white/40 mt-0.5 truncate">{truncateText(item.result, 40)}</p>
          </div>
        </div>
      </button>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity duration-200">
        <HistoryItemMenu
          item={item}
          onStartRename={startEdit}
          onPin={onPin}
          onDelete={onDelete}
          t={t}
        />
      </div>
    </div>
  );
}

export default function SidebarHistory({
  items,
  loading,
  onRefresh,
  onItemClick,
  onItemsChange,
}) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [localItems, setLocalItems] = useState(items);
  const skipNextSyncRef = useRef(false);

  useEffect(() => {
    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }
    setLocalItems(items);
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return localItems;
    const query = searchQuery.toLowerCase();
    return localItems.filter(
      (item) =>
        ((item.title || item.context) && (item.title || item.context).toLowerCase().includes(query)) ||
        (item.result && item.result.toLowerCase().includes(query))
    );
  }, [localItems, searchQuery]);

  const handleRename = useCallback((id, newTitle) => {
    skipNextSyncRef.current = true;
    setLocalItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, title: newTitle } : item
      )
    );
    onItemsChange?.(localItems.map((item) =>
      item.id === id ? { ...item, title: newTitle } : item
    ));
  }, [localItems, onItemsChange]);

  const handlePin = useCallback((id, isPinned) => {
    skipNextSyncRef.current = true;
    setLocalItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, is_pinned: isPinned } : item
      );
      return updated.sort((a, b) => {
        if (a.is_pinned === b.is_pinned) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        return a.is_pinned ? -1 : 1;
      });
    });
    onItemsChange?.(localItems);
  }, [localItems, onItemsChange]);

  const handleDelete = useCallback((id) => {
    skipNextSyncRef.current = true;
    setLocalItems((prev) => prev.filter((item) => item.id !== id));
    onItemsChange?.(localItems.filter((item) => item.id !== id));
  }, [localItems, onItemsChange]);

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchHistory")}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/[0.15] focus:bg-white/[0.06] transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.08] transition-all duration-200"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
          {t("historyTitle")}
        </span>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="w-6 h-6 rounded flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all duration-200 disabled:opacity-40"
          title={t("refresh")}
        >
          {loading ? (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1 thin-scrollbar">
        {loading && !filteredItems.length ? (
          <div className="space-y-2 px-1">
            <div className="h-14 rounded-lg bg-white/[0.04] animate-skeleton" />
            <div className="h-14 rounded-lg bg-white/[0.04] animate-skeleton" />
            <div className="h-14 rounded-lg bg-white/[0.04] animate-skeleton" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="px-2 py-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
              <svg className="w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-white/30">
              {searchQuery ? t("noSearchResults") : t("noHistory")}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              onClick={onItemClick}
              onRename={handleRename}
              onPin={handlePin}
              onDelete={handleDelete}
              t={t}
            />
          ))
        )}
      </div>
    </div>
  );
}
