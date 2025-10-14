"use client";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-surface rounded-2xl shadow-lg p-8 mb-12 border border-border">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image skeleton */}
              <div className="flex justify-center">
                <div className="bg-btn-background rounded-2xl p-8 w-full max-w-md border border-border-subtle animate-pulse h-[420px]" />
              </div>
              {/* Details skeleton */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="h-8 w-3/4 bg-border-subtle rounded animate-pulse" />
                  <div className="h-6 w-1/3 bg-border-subtle rounded animate-pulse" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-border-subtle rounded animate-pulse" />
                  <div className="h-4 w-11/12 bg-border-subtle rounded animate-pulse" />
                  <div className="h-4 w-10/12 bg-border-subtle rounded animate-pulse" />
                </div>
                <div className="flex items-center space-x-3">
                  <LoadingSpinner />
                  <p className="text-text-secondary">Loading product...</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews skeleton */}
          <div className="bg-surface rounded-2xl shadow-lg p-8 border border-border">
            <div className="h-7 w-40 bg-border-subtle rounded animate-pulse mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-6 rounded-2xl border-2 border-border-subtle space-y-4 animate-pulse">
                  <div className="h-5 w-24 bg-border-subtle rounded" />
                  <div className="h-4 w-full bg-border-subtle rounded" />
                  <div className="h-4 w-3/4 bg-border-subtle rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}