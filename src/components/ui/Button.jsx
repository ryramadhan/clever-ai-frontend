export default function Button({ children, disabled, loading, ...props }) {
  return (
    <button
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] bg-white text-[#0a0a0a] font-medium text-sm transition-all duration-200 ease hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled || loading}
      {...props}
    >
      <span>{children}</span>
      {loading && (
        <span
          className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin-slow"
          aria-hidden="true"
        />
      )}
    </button>
  );
}

