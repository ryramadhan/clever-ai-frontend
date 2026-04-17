import { useState, useMemo } from "react";
import { useLanguage } from "../../contexts/LanguageContext.jsx";

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

export default function SidebarHistory({
  items,
  loading,
  onRefresh,
  onItemClick,
}) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        (item.context && item.context.toLowerCase().includes(query)) ||
        (item.result && item.result.toLowerCase().includes(query))
    );
  }, [items, searchQuery]);

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
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1 scrollbar-hide">
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
            <button
              key={item.id}
              onClick={() => onItemClick(item)}
              className="w-full text-left px-3 py-3 rounded-lg hover:bg-white/[0.06] transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 group-hover:text-white/95 truncate transition-colors">
                    {truncateText(item.context || t("untitledChat"), 50)}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5 truncate">
                    {truncateText(item.result, 40)}
                  </p>
                </div>
                <span className="text-[10px] text-white/25 flex-shrink-0">
                  {formatDateShort(item.created_at)}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
