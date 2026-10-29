import React from 'react';
import { SearchX } from 'lucide-react';

export default function EmptyState({
  title = 'No records found',
  message = 'Try adjusting your search query or loosening your risk/probability filters.',
  action,
  icon: Icon = SearchX,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-surface-1 p-8 sm:p-12 text-center shadow-lg">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-brand-400 shadow-inner">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-base font-heading font-bold text-white tracking-tight">{title}</h3>
      <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
        {message}
      </p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
