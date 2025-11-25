'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-shell)] px-4">
      <div className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center shadow-lg">
        <div className="mb-4 text-6xl">⚠️</div>
        <h1 className="mb-2 text-2xl font-bold text-[var(--text-primary)]">
          Something went wrong!
        </h1>
        <p className="mb-6 text-sm text-[var(--text-secondary)]">
          We encountered an error while loading the application. This could be due to:
        </p>
        <ul className="mb-6 space-y-2 text-left text-sm text-[var(--text-secondary)]">
          <li>• Database connection issues</li>
          <li>• Authentication session expired</li>
          <li>• Missing configuration</li>
        </ul>
        
        {error.digest && (
          <p className="mb-4 text-xs text-[var(--text-tertiary)]">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/en"
            className="rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
