export function Skeleton({ className = '' }) {
  return (
    <div
      className={`rounded-md bg-gray-200/70 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)]
        bg-[length:400px_100%] bg-no-repeat animate-shimmer ${className}`}
    />
  )
}

export default Skeleton

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((__, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="p-5 bg-white rounded-xl border border-gray-100">
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-7 w-16" />
    </div>
  )
}
