import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({
  message = 'Unable to establish connection with the RetainAI backend.',
  onRetry,
}) {
  return (
    <div
      className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-6 text-center shadow-xl backdrop-blur-sm"
      role="alert"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-3 text-base font-heading font-bold text-white tracking-tight">System Notice</h3>
      <p className="mt-1.5 text-xs sm:text-sm text-rose-200/80 max-w-md mx-auto leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-600/30 px-4 py-2 text-xs font-semibold text-rose-200 border border-rose-500/40 hover:bg-rose-600/50 hover:text-white transition-all shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Retry Request
        </button>
      )}
    </div>
  );
}
