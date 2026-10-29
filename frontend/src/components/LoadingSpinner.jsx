import React from 'react';

export default function LoadingSpinner({
  message = 'Loading predictive models and retention data...',
}) {
  return (
    <div
      className="flex min-h-[320px] flex-col items-center justify-center p-8 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-brand/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
      </div>
      <p className="mt-4 text-xs sm:text-sm font-medium text-slate-400 max-w-sm font-sans">
        {message}
      </p>
    </div>
  );
}
