import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

/**
 * StatusPill
 * Displays live backend and ML pipeline health.
 * Accessible with aria-live="polite".
 */
export default function StatusPill({ status = 'connecting', latency = null, lastUpdated = null }) {
  const configs = {
    active: {
      label: 'API & ML Model Active',
      sublabel: 'Operational',
      dotClass: 'bg-emerald-400',
      pingClass: 'bg-emerald-400',
      borderClass: 'border-emerald-500/30',
      bgClass: 'bg-emerald-950/20 text-emerald-300',
      icon: CheckCircle2,
    },
    degraded: {
      label: 'Performance Degraded',
      sublabel: 'High Latency',
      dotClass: 'bg-amber-400',
      pingClass: 'bg-amber-400',
      borderClass: 'border-amber-500/30',
      bgClass: 'bg-amber-950/20 text-amber-300',
      icon: AlertTriangle,
    },
    offline: {
      label: 'Backend Offline',
      sublabel: 'Service Unavailable',
      dotClass: 'bg-rose-500',
      pingClass: 'bg-rose-500',
      borderClass: 'border-rose-500/30',
      bgClass: 'bg-rose-950/20 text-rose-300',
      icon: XCircle,
    },
    connecting: {
      label: 'Connecting System...',
      sublabel: 'Verifying Telemetry',
      dotClass: 'bg-indigo-400',
      pingClass: 'bg-indigo-400',
      borderClass: 'border-indigo-500/30',
      bgClass: 'bg-indigo-950/20 text-indigo-300',
      icon: RefreshCw,
    },
  };

  const current = configs[status] || configs.connecting;
  const Icon = current.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md shadow-sm transition-all ${current.bgClass} ${current.borderClass}`}
      role="status"
      aria-live="polite"
      title={lastUpdated ? `System operational. Last verified at ${lastUpdated}` : 'RetainAI Inference Engine Status'}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.pingClass}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dotClass}`} />
      </span>
      <span className="font-semibold text-slate-100 flex items-center gap-1.5">
        <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
        {current.label}
        {latency && <span className="text-[10px] text-slate-400 font-normal">({latency}ms)</span>}
      </span>
    </div>
  );
}
