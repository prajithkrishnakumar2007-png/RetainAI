import React, { useState, useEffect } from 'react';
import { Menu, Clock } from 'lucide-react';
import { getHealth } from '../services/api';
import StatusPill from './StatusPill';
import { useLayout } from '../context/LayoutContext';

export default function Header({
  title,
  subtitle,
  onMenuClick,
  rightActions,
}) {
  const { toggleMobile } = useLayout();
  const handleMenuClick = onMenuClick || toggleMobile;
  const [healthStatus, setHealthStatus] = useState('connecting');
  const [latency, setLatency] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const startTime = performance.now();

    getHealth()
      .then((data) => {
        if (!isMounted) return;
        const endTime = performance.now();
        setLatency(Math.round(endTime - startTime));
        if (data.status === 'healthy' && data.model_loaded) {
          setHealthStatus('active');
        } else {
          setHealthStatus('degraded');
        }
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      })
      .catch(() => {
        if (!isMounted) return;
        setHealthStatus('offline');
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="h-16 border-b border-white/10 bg-surface-1/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={handleMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 shrink-0"
          aria-label="Open primary navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-heading font-extrabold text-white tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-400 truncate hidden sm:block font-sans">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Actions & Live Telemetry Pill */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {rightActions}

        {lastUpdated && (
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <Clock className="h-3 w-3 text-slate-500" />
            <span>Updated {lastUpdated}</span>
          </div>
        )}

        <StatusPill status={healthStatus} latency={latency} lastUpdated={lastUpdated} />
      </div>
    </header>
  );
}
