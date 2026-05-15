/**
 * Skeleton shown by `next/dynamic` while the BikeViewer chunk (three.js +
 * R3F, ~600KB) downloads on the client. Once the Canvas mounts, the
 * Suspense fallback inside BikeViewer takes over — see PrimitiveBike.
 */
export default function BikeViewerSkeleton() {
  return (
    <div
      className="w-full h-full flex items-end justify-center animate-pulse bg-gradient-to-br from-surface-hover to-surface"
      role="status"
      aria-label="Loading 3D view"
    >
      <span className="pb-3 text-[11px] uppercase tracking-wider text-text-muted">
        Loading 3D view…
      </span>
    </div>
  )
}
