import React from 'react';

/**
 * ROIBadge
 * Highlights return on retention offer investment using tabular numbers.
 */
export default function ROIBadge({ roi = 0, size = 'md' }) {
  const numRoi = Number(roi);
  const isPositive = numRoi >= 0;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-bold',
  };

  const formatted = `${isPositive ? '+' : ''}${numRoi.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })}% ROI`;

  return (
    <span
      className={`inline-flex items-center tabular-nums rounded-md border font-sans tracking-tight shrink-0 ${
        isPositive
          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
          : 'bg-rose-950/40 text-rose-300 border-rose-500/30'
      } ${sizeClasses[size] || sizeClasses.md}`}
    >
      {formatted}
    </span>
  );
}
