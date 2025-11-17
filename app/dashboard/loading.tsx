export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-[hsl(var(--surface))]">
      <div className="flex flex-col items-center">
        <div className="animate-spin h-6 w-6 border-2 border-[hsl(var(--btn-primary))] border-t-transparent rounded-full" />
        <p className="mt-4 text-[hsl(var(--text-secondary))]">Loading dashboard...</p>
      </div>
    </div>
  );
}