import React from 'react';

export function SkeletonBox({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-surface-2/80 border border-white/5 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonKPICard({ variant = 'standard' }) {
  return (
    <div className={`rounded-xl border border-white/5 bg-surface-1 p-5 shadow-lg ${variant === 'hero' ? 'border-brand/20 bg-surface-1/90' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 w-3/4">
          <SkeletonBox className="h-3 w-24" />
          <SkeletonBox className="h-8 w-36" />
          <SkeletonBox className="h-3 w-48" />
        </div>
        <SkeletonBox className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 6, cols = 7 }) {
  return (
    <div className="rounded-xl border border-white/5 bg-surface-1 overflow-hidden p-4 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <SkeletonBox className="h-4 w-40" />
        <SkeletonBox className="h-8 w-24" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <SkeletonBox key={j} className="h-5 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonChart({ height = 'h-64' }) {
  return (
    <div className="rounded-xl border border-white/5 bg-surface-1 p-5 space-y-4">
      <div className="space-y-2">
        <SkeletonBox className="h-4 w-48" />
        <SkeletonBox className="h-3 w-64" />
      </div>
      <SkeletonBox className={`w-full ${height} rounded-lg`} />
    </div>
  );
}

export default function SkeletonLoader({ type = 'kpi', count = 4 }) {
  if (type === 'table') return <SkeletonTable />;
  if (type === 'chart') return <SkeletonChart />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonKPICard key={i} />
      ))}
    </div>
  );
}
