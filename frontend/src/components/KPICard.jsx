import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * KPICard
 * Data-driven KPI card with executive hierarchy:
 * - 'hero': 40px prominent metric, subtle brand border, primary focus
 * - 'standard': 28px metric, structured surface
 * - 'compact': 20px metric for dense layouts
 */
export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendDirection,
  variant = 'standard',
  href,
  onClick,
  tag,
  color = 'neutral',
  helpText,
}) {
  // Color presets (respecting semantic rules: risk is only for risk metrics)
  const colorStyles = {
    neutral: {
      border: 'border-white/10 hover:border-white/20',
      iconBg: 'bg-white/5 text-slate-300 border-white/10',
      badge: 'bg-white/5 text-slate-300',
    },
    brand: {
      border: 'border-brand/40 bg-gradient-to-b from-brand/10 to-surface-1 hover:border-brand/60',
      iconBg: 'bg-brand/20 text-brand-400 border-brand/30',
      badge: 'bg-brand/15 text-brand-400 border border-brand/30',
    },
    accent: {
      border: 'border-accent/40 bg-gradient-to-b from-accent/10 to-surface-1 hover:border-accent/60',
      iconBg: 'bg-accent/20 text-accent-400 border-accent/30',
      badge: 'bg-accent/15 text-accent-400 border border-accent/30',
    },
    riskCritical: {
      border: 'border-risk-critical/40 bg-gradient-to-b from-risk-critical/10 to-surface-1 hover:border-risk-critical/60',
      iconBg: 'bg-risk-critical/20 text-risk-critical border-risk-critical/30',
      badge: 'bg-risk-critical/15 text-risk-critical border border-risk-critical/30',
    },
    riskHigh: {
      border: 'border-risk-high/40 bg-gradient-to-b from-risk-high/10 to-surface-1 hover:border-risk-high/60',
      iconBg: 'bg-risk-high/20 text-risk-high border-risk-high/30',
      badge: 'bg-risk-high/15 text-risk-high border border-risk-high/30',
    },
    riskLow: {
      border: 'border-risk-low/40 bg-gradient-to-b from-risk-low/10 to-surface-1 hover:border-risk-low/60',
      iconBg: 'bg-risk-low/20 text-risk-low border-risk-low/30',
      badge: 'bg-risk-low/15 text-risk-low border border-risk-low/30',
    },
    positive: {
      border: 'border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-surface-1 hover:border-emerald-500/50',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      badge: 'bg-emerald-500/15 text-emerald-400',
    },
  };

  const currentTheme = colorStyles[color] || colorStyles.neutral;
  const isHero = variant === 'hero';

  const content = (
    <div
      className={`group relative overflow-hidden rounded-xl border bg-surface-1 p-5 transition-all duration-200 shadow-lg ${
        currentTheme.border
      } ${isHero ? 'card-hero-glow lg:p-6' : 'hover:-translate-y-0.5'}`}
    >
      {/* Top row: Label + Icon + Optional Tag */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans"
              title={helpText}
            >
              {title}
            </span>
            {tag && (
              <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${currentTheme.badge}`}>
                {tag}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {Icon && (
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg border p-2 transition-transform group-hover:scale-105 ${currentTheme.iconBg}`}>
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
          )}
          {href && (
            <div className="text-slate-500 group-hover:text-brand-400 transition-colors">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>

      {/* Hero / Standard KPI Metric Value */}
      <div className="mt-3 flex items-baseline gap-2">
        <h3
          className={`font-heading font-extrabold tracking-tight text-white tabular-nums ${
            isHero ? 'text-3xl lg:text-4xl' : 'text-2xl'
          }`}
        >
          {value}
        </h3>
      </div>

      {/* Subtitle / Context */}
      {subtitle && (
        <p className="mt-1 text-xs text-slate-400 leading-relaxed font-sans">
          {subtitle}
        </p>
      )}

      {/* Trend indicator if provided */}
      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium pt-2 border-t border-white/5">
          {trendDirection === 'up' && <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />}
          {trendDirection === 'down' && <TrendingDown className="h-3.5 w-3.5 text-slate-400" />}
          <span className="text-slate-300 tabular-nums">{trend}</span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="block focus:outline-none" aria-label={`${title}: ${value}`}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full text-left focus:outline-none" aria-label={`${title}: ${value}`}>
        {content}
      </button>
    );
  }

  return content;
}
