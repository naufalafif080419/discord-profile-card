'use client';

export function LoadingSkeleton() {
  return (
    <div className="w-full h-full animate-pulse relative overflow-hidden" aria-label="Loading profile" role="status" aria-live="polite">
      {/* Banner skeleton */}
      <div className="h-32 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-t-2xl" />
      
      {/* Profile content skeleton */}
      <div className="p-6 space-y-4">
        {/* Avatar and name skeleton */}
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-zinc-800/50" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-32 bg-zinc-800/50 rounded" />
            <div className="h-4 w-24 bg-zinc-800/50 rounded" />
          </div>
        </div>

        {/* Bio skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-zinc-800/50 rounded" />
          <div className="h-4 w-3/4 bg-zinc-800/50 rounded" />
        </div>

        {/* Badges skeleton */}
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-6 h-6 rounded bg-zinc-800/50" />
          ))}
        </div>

        {/* Activity card skeleton */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <div className="h-4 w-20 bg-zinc-800/50 rounded" />
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-lg bg-zinc-800/50" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-zinc-800/50 rounded" />
              <div className="h-3 w-24 bg-zinc-800/50 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
      
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

