export default function HistorySkeleton({ count = 5 }) {
  return (
    <div className="space-y-3 px-2 py-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-10 rounded-lg bg-white/[0.04] animate-pulse"
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          {/* Inner shimmer effect */}
          <div className="h-full w-full relative overflow-hidden rounded-lg">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-shimmer"
              style={{
                animationDelay: `${index * 100 + 200}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
