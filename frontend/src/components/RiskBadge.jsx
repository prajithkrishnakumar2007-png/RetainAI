import React from 'react';

/**
 * RiskBadge
 * Semantic risk badge ensuring risk is communicated through Text + Badge + Color (WCAG 2.2 AA).
 */
export default function RiskBadge({ risk = 'Low', size = 'md' }) {
  const styles = {
    Low: {
      pill: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      dot: 'bg-emerald-400',
      label: 'Low Risk',
      threshold: '< 30%',
    },
    Medium: {
      pill: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      dot: 'bg-amber-400',
      label: 'Medium Risk',
      threshold: '30-60%',
    },
    High: {
      pill: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
      dot: 'bg-orange-400',
      label: 'High Risk',
      threshold: '60-80%',
    },
    Critical: {
      pill: 'bg-rose-500/15 text-rose-300 border-rose-500/30 ring-1 ring-rose-500/20',
      dot: 'bg-rose-400 animate-pulse',
      label: 'Critical Risk',
      threshold: '≥ 80%',
    },
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-2',
    lg: 'px-3.5 py-1.5 text-sm font-semibold gap-2.5',
  };

  const current = styles[risk] || {
    pill: 'bg-slate-800 text-slate-300 border-slate-700',
    dot: 'bg-slate-400',
    label: `${risk} Risk`,
    threshold: '',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-sm font-sans shrink-0 ${current.pill} ${sizeClasses[size] || sizeClasses.md}`}
      title={`${current.label} (${current.threshold})`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`} aria-hidden="true" />
      <span>{current.label}</span>
    </span>
  );
}
