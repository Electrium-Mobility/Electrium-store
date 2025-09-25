'use client'

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-3xl font-bold text-status-error-text mb-4">Oops! Something went wrong.</h1>
      <p className="text-lg text-text-secondary mb-6">We're sorry for the inconvenience. Please try refreshing the page, or contact support if the problem persists.</p>
      <button
        onClick={() => window.location.href = '/'}
        className="bg-green-600 text-text-inverse px-6 py-3 rounded-md hover:bg-green-700 transition"
      >
        Go to Homepage
      </button>
    </div>
  );
}
